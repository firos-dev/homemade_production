import { Items } from "../modules/Items";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { AppDataSource } from "./../index";
const unlinkAsync = promisify(fs.unlink);

require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const createItem = async (req: any, res: any, next: any) => {
  const {
    chef_id,
    cuisine_id,
    name,
    unit,
    portion_size,
    price,
    available,
    description,
    ingredients,
    allergic_ingredients,
    type,
    status,
  } = req.body;

  try {
    const imageArr = req.files;
    let images: any = [];
    let imageKeys: any = [];

    if (imageArr.length > 0) {
      await Promise.all(
        imageArr.map(async (image: any) => {
          let imageResult = await uploadFile(
            image,
            `${chef_id}/items/` + image.filename
          );
          images.push(imageResult.Location);
          imageKeys.push(imageResult.Key);
          await unlinkAsync(image.path);
        })
      );
    }

    const item = Items.create({
      chef_id,
      cuisine_id,
      name,
      unit,
      portion_size,
      price,
      images: images,
      image_keys: imageKeys,
      available,
      description,
      ingredients,
      allergic_ingredients,
      type,
      status,
    });
    if (!chef_id) {
      throw new Error("Chef ID required");
    }
    await item.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getItems = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };

  let body = req.query;

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  let relations = ["chef", "chef.user", "reviews", "chef.reviews"];
  try {
    let items = await Items.find({
      where: body,
      ...offset,
      relations,
      order: { created_at: "DESC" },
    });

    items = items.map((item: any) => {
      let totalReviews = item.reviews.length;
      let reviewSum = item.reviews.reduce(
        (a: any, b: any) => a + Number(b.star_count),
        0
      );
      let itemStar = reviewSum / totalReviews;
      return {
        ...item,
        item_star: itemStar ? itemStar.toFixed(1) : "0",
        item_reviews: totalReviews,
      };
    });

    res.status(200).json({
      status: 0,
      data: items,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateItem = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    let item: any = await Items.findOne({ where: { id } });
    const imageArr = req.files;
    let images: any = [];
    let imageKeys: any = [];

    if (imageArr.length > 0) {
      await Promise.all(
        imageArr.map(async (image: any) => {
          let imageResult = await uploadFile(
            image,
            `${item.chef_id}/items/` + image.filename
          );
          images.push(imageResult.Location);
          imageKeys.push(imageResult.Key);
          await unlinkAsync(image.path);
        })
      );
    }

    let body = {
      ...req.body,
    };

    let updated_images: any;
    let updated_image_keys: any;
    if (body?.deleted_images) {
      let deleted_images = JSON.parse(body.deleted_images);

      deleted_images.map((index: any) => {
        updated_images = item.images;
        updated_image_keys = item.image_keys;
        updated_images.splice(index, 1);
        updated_image_keys.splice(index, 1);
      });
      delete body.deleted_images;
    }

    if (images?.length) {
      updated_images = [...updated_images, ...images];
      updated_image_keys = [...updated_image_keys, ...imageKeys];
    }

    if (updated_images?.length) {
      body.images = updated_images;
      body.image_keys = updated_image_keys;
    }

    if (body?.images?.length > 7) {
      throw new Error("Image file count exceeded");
    }

    await Items.update({ id }, { ...body });
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const getNearestItemsbyAvailability = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };

  let body = req.query;

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  let days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const { latitude, longitude, day } = req.query;

  try {
    if (!latitude || !longitude || !day || !days.includes(day)) {
      throw new Error("Invalid request");
    }
    const itemsIds = await AppDataSource.query(`SELECT i.id,
      ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC)) ) 
        * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
        * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) AS distance
      FROM items i
      JOIN chefs c ON i.chef_id = c.id
      JOIN locations l ON c.drop_off_point_id = l.id
      JOIN availabilities a ON a.chef_id = c.id
      WHERE a.${day} = true AND i.status != 'Deleted' AND c.status != 'Deleted' AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC) ) ) 
        * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
        * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) < 50
      ORDER BY distance
      LIMIT ${offset.take} OFFSET ${offset.skip}`);

    let ids = itemsIds.map((r: any) => r.id);

    let items = await AppDataSource.getRepository(Items)
      .createQueryBuilder("items")
      .leftJoinAndSelect("items.reviews", "reviews")
      .leftJoinAndSelect("items.chef", "chef")
      .where("items.id IN (:...ids)", { ids })
      .getMany();

    res.status(200).json({
      status: 0,
      data: items,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default {
  createItem,
  getItems,
  updateItem,
  getNearestItemsbyAvailability,
};

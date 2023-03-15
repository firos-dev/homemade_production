import { Items } from "../modules/Items";
import multer from "multer";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
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
  let imageKey, imageUrl;
  let image2Key, image2Url;
  try {
    const { image, image2 } = req.files;

    let imageUploaded = image && image !== "undefined";

    let image2Uploaded = image2 && image2 !== "undefined";

    if (imageUploaded || image2Uploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `${chef_id}/items/` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (image2Uploaded) {
        let image2Result = await uploadFile(
          image2[0],
          `${chef_id}/items/` + image2[0].filename
        );

        if (image2Result) {
          image2Key = image2Result.Key;
          image2Url = image2Result.Location;
        }
        await unlinkAsync(image2[0].path);
      }
    }

    const item = Items.create({
      chef_id,
      cuisine_id,
      name,
      unit,
      portion_size,
      price,
      image: imageUrl,
      image_key: imageKey,
      image2_key: image2Key,
      image2: image2Url,
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
  try {
    const items = await Items.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
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
  let file = req.file;
  let imageKey, imageUrl;
  let image2Key, image2Url;
  try {
    const { image, image2 } = req.files;
    let item: any = await Items.findOne(id);

    let imageUploaded = image && image !== "undefined";

    let image2Uploaded = image2 && image2 !== "undefined";

    if (imageUploaded || image2Uploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `${item.chef_id}/items/` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (image2Uploaded) {
        let image2Result = await uploadFile(
          image2[0],
          `${item.chef_id}/items/` + image2[0].filename
        );

        if (image2Result) {
          image2Key = image2Result.Key;
          image2Url = image2Result.Location;
        }
        await unlinkAsync(image2[0].path);
      }
    }
    let body = {
      ...req.body,
    };
    if (image) {
      body.image = imageUrl;
      body.image_key = imageKey;
    }
    if (image2) {
      body.image2 = image2Url;
      body.image2_key = image2Key;
    }
    await Items.update({ id }, { ...req.body });
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { createItem, getItems, updateItem };

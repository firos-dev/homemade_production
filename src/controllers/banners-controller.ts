import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { Banners } from "../modules/Banners";
import { Not } from "typeorm";
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

const addBanners = async (req: any, res: any, next: any) => {
  const { chef_id, name } = req.body;

  try {
    const imageArr = req.files;
    let images: any = [];
    let image_keys: any = [];
    if (imageArr.length > 0) {
      await Promise.all(
        imageArr.map(async (image: any) => {
          let imageResult = await uploadFile(
            image,
            `banners/` + image.filename
          );
          images.push(imageResult.Location);
          image_keys.push(imageResult.Key);
          await unlinkAsync(image.path);
        })
      );
    }

    const banner = Banners.create({
      name,
      chef_id,
      images,
      image_keys,
    });

    await banner.save();

    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: banner,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getBanners = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };

  let body = { ...req.query, status: Not("Deleted") };

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  try {
    const followers = await Banners.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: followers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const deleteBanner = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    let banner = await Banners.findOne({where: {id}})
    if(!banner){
      throw new Error("Something went wrong. Please try again")
    }

    await Banners.delete({ id });
    res.status(200).json({
      status: 0,
      data: "Data has been successfully deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { addBanners, getBanners, deleteBanner };

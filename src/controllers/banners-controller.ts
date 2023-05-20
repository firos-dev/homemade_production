import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { Banners } from "../modules/Banners";
import { Not } from "typeorm";
const unlinkAsync = promisify(fs.unlink);

require("dotenv").config();

const addBanners = async (req: any, res: any, next: any) => {
  const { chef_id, name, banner_type } = req.body;

  try {
    const imageFile = req.file;

    let image;
    let image_key;
    if (imageFile) {
      let imageResult = await uploadFile(
        imageFile,
        `banners/` + imageFile.filename
      );
      await unlinkAsync(imageFile.path);
      image = imageResult.Location;
      image_key = imageResult.Key;
    }

    const banner = Banners.create({
      name,
      chef_id,
      image,
      image_key,
      banner_type,
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
    let banner = await Banners.findOne({ where: { id } });
    if (!banner) {
      throw new Error("Something went wrong. Please try again");
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

import { Items } from "./../modules/Items";
import { Status } from "../helpers/enums";
import { Cuisines } from "../modules/Cuisines";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
const unlinkAsync = promisify(fs.unlink);

const createCuisine = async (req: any, res: any, next: any) => {
  let imageKey, imageUrl;
  let iconKey, iconUrl;
  try {
    const { image, icon } = req.files;

    let imageUploaded = image && image !== "undefined";

    let iconUploaded = icon && icon !== "undefined";

    if (imageUploaded || iconUploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `cuisines/images` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (iconUploaded) {
        let iconResult = await uploadFile(
          icon[0],
          `cuisines/icons/` + icon[0].filename
        );

        if (iconResult) {
          iconKey = iconResult.Key;
          iconUrl = iconResult.Location;
        }
        await unlinkAsync(icon[0].path);
      }
    }

    const body = {
      ...req.body,
      image: imageUrl,
      icon: iconUrl,
      image_key: imageKey,
      icon_key: iconKey,
    };
    const cuisine = Cuisines.create(body);
    await cuisine.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: cuisine,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCuisines = async (req: any, res: any, next: any) => {
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
    body = {
      ...body,
      status: Status.ACTIVE,
    };
    const cuisines = await Cuisines.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: cuisines,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const getCuisineItems = async (req: any, res: any, next: any) => {
  try {
    const cuisines = await Cuisines.find({
      order: { created_at: "DESC" },
    });
    let cuisineData: any = [];
    if (cuisines.length) {
      return Promise.all(
        cuisines.map(async (cuisine) => {
          let [items, count] = await Items.findAndCount({
            relations: ["chef", "chef.user"],
            where: { cuisine_id: cuisine.id, status: Status.ACTIVE },
            take: 2,
          });
          cuisineData.push({
            ...cuisine,
            items,
            count,
          });
        })
      ).then(() => {
        res.status(200).json({
          status: 0,
          data: cuisineData,
        });
      });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateCuisine = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  let imageKey, imageUrl;
  let iconKey, iconUrl;
  try {
    let body: any = {
      ...req.body,
    };

    let image, icon
    if (req.files) {
      image = req.files.image;
      icon = req.files.icon;
    }

    let imageUploaded = image && image !== "undefined";

    let iconUploaded = icon && icon !== "undefined";

    if (imageUploaded || iconUploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `cuisines/images` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (iconUploaded) {
        let iconResult = await uploadFile(
          icon[0],
          `cuisines/icons/` + icon[0].filename
        );

        if (iconResult) {
          iconKey = iconResult.Key;
          iconUrl = iconResult.Location;
        }
        await unlinkAsync(icon[0].path);
      }
    }
    if (image) {
      body = {
        ...body,
        image: imageUrl,
        image_key: imageKey,
      };
    }

    if (icon) {
      body = {
        ...body,
        icon: iconUrl,
        icon_key: iconKey,
      };
    }
    console.log(body);
    
    await Cuisines.update({ id }, { ...body });
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

export default { createCuisine, getCuisines, getCuisineItems, updateCuisine };

import { Items } from "./../modules/Items";
import { Status } from "../helpers/enums";
import { Cuisines } from "../modules/Cuisines";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { AppDataSource } from "../";
import { Chefs } from "../modules/Chefs";
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
      message: error.message,
    });
  }
};

const getCuisineItems = async (req: any, res: any, next: any) => {
  const { latitude, longitude, day } = req.query;
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };
  try {
    const cuisines = await Cuisines.find({
      order: { created_at: "DESC" },
    });
    let cuisineData: any = [];
    if (cuisines.length) {
      return Promise.all(
        cuisines.map(async (cuisine) => {
          const chefIds = await AppDataSource.query(`SELECT c.id,a.${day},
          ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC)) ) 
            * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
            * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) AS distance
          FROM chefs c
          INNER JOIN items ON items.chef_id = c.id
          JOIN locations l ON c.location_id = l.id
          JOIN availabilities a ON a.chef_id = c.id
          WHERE c.status != 'Deleted' AND c.status != 'Inactive' AND c.verified=true AND items.id IS NOT NULL AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC) ) ) 
          * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
          * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) < 50
          ORDER BY distance`);

          let ids = chefIds.map((r: any) => r.id);
          let chefResult: any = [[], 0];
          if (ids.length) {
            chefResult = await AppDataSource.getRepository(Items)
              .createQueryBuilder("items")
              .leftJoinAndSelect("items.chef", "chef")
              .leftJoinAndSelect("chef.user", "user")
              .where("items.chef_id IN (:...ids)", { ids })
              .andWhere("items.cuisine_id = :cid", { cid: cuisine.id })
              .take(offset.take)
              .skip(offset.skip)
              .getManyAndCount();
          }

          let [items, count] = chefResult;

          cuisineData.push({
            ...cuisine,
            items,
            count,
          });
        })
      )
        .then(() => {
          res.status(200).json({
            status: 0,
            data: cuisineData,
          });
        })
        .catch((e) => {
          console.log(e);

          res.status(400).json({
            status: 1,
            message: e.message,
          });
        });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
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

    let image, icon;
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

import { Locations } from "./../modules/Locations";
import { UserType } from "./../helpers/enums";
import { AddressType } from "../helpers/enums";
import { Users } from "../modules/User";
import { Chefs } from "./../modules/Chefs";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { AppDataSource } from "../";
import { OrderChefStatus } from "./../helpers/enums";
import { Not } from "typeorm";
import { Settings } from "../modules/Settings";
import { Availabilities } from "../modules/Availabilities";
const unlinkAsync = promisify(fs.unlink);

const createChef = async (req: any, res: any, next: any) => {
  const {
    user_id,
    first_name,
    middle_name,
    last_name,
    full_name,
    bio,
    cuisine_id,
    dietry_id,
    spicy_level_id,
    description,
    terms_accepted,
    drop_off_point_id,
    certificate_number,
    address_line_one,
    address_line_two,
    latitude,
    longitude,
    area,
    state,
    status,
    city,
    zip_code,
    country,
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  } = req.body;

  let locationUpdate = [
    "address_line_one",
    "address_line_two",
    "latitude",
    "longitude",
    "area",
    "state",
    "city",
    "zip_code",
    "country",
    "address_type",
  ];
  const keys = Object.keys(req.body);

  let imageKey, imageUrl;
  let certificateKey, certificateUrl;

  try {
    const chefData = await Chefs.findOne({
      where: { user_id },
    });

    const commission: any = await Settings.findOne({
      where: { name: "chef_commission" },
    });

    if (chefData) {
      await Users.update(
        { id: user_id },
        {
          user_type: UserType.CHEF,
        }
      );
      res.status(201).json({
        status: 0,
        message: "Chef is already exist",
        chefData,
      });
      return;
    }
    const { image, certificate_file } = req.files;

    let imageUploaded = image && image !== "undefined";

    let certificateUploaded =
      certificate_file && certificate_file !== "undefined";

    if (imageUploaded || certificateUploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `${user_id}/avatars/` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (certificateUploaded) {
        let certificateResult = await uploadFile(
          certificate_file[0],
          `${user_id}/certificates/` + certificate_file[0].filename
        );

        if (certificateResult) {
          certificateKey = certificateResult.Key;
          certificateUrl = certificateResult.Location;
        }
        await unlinkAsync(certificate_file[0].path);
      }
    }
    let locationValues = keys.filter((value) => locationUpdate.includes(value));

    await Users.update(
      { id: user_id },
      {
        first_name,
        middle_name,
        last_name,
        full_name,
        user_type: UserType.CHEF,
      }
    );
    let chef: any;
    chef = Chefs.create({
      user_id,
      bio,
      image: imageUrl,
      image_key: imageKey,
      cuisine_id,
      dietry_id,
      spicy_level_id,
      description,
      terms_accepted,
      drop_off_point_id,
      status,
      certificate_file: certificateUrl,
      certificate_key: certificateKey,
      certificate_number,
      commission: commission?.value,
      commission_single_change: true,
    });
    await chef.save();

    if (locationValues.length) {
      const location = Locations.create({
        user_id,
        address_line_one,
        address_line_two,
        latitude,
        longitude,
        area,
        state,
        city,
        zip_code,
        country,
        address_type: AddressType.SERVICE_ADDRES,
      });

      await location.save();
    }

    const avail = Availabilities.create({
      chef_id: chef.id,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
    });
    await avail.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      chef,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getChefs = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };
  let body: any = {};

  body = {
    ...body,
    ...req.query,
  };

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }

  let relations = [
    "user",
    "cuisine",
    "spicy_level",
    "dietry",
    "user.locations",
    "drop_off_point",
    "availability",
    "reviews",
    "items",
    "items.reviews",
    "orders",
  ];
  if (body.includeFollowing) {
    relations.push("user.following");
  }
  if (body.includeFollowers) {
    relations.push("user.followers");
  }
  if (body.day) {
    body = {
      ...body,
      [`availability.${body.day}`]: true,
    };
    delete body.day;
  }

  try {
    let query = AppDataSource.getRepository(Chefs)
      .createQueryBuilder("chefs")
      .leftJoinAndSelect("chefs.user", "user")
      .leftJoinAndSelect("chefs.cuisine", "cuisine")
      .leftJoinAndSelect("chefs.spicy_level", "spicy_level")
      .leftJoinAndSelect("chefs.dietry", "dietry")
      .leftJoinAndSelect("user.locations", "locations")
      .leftJoinAndSelect("chefs.drop_off_point", "drop_off_point")
      .leftJoinAndSelect("chefs.availability", "availability")
      .leftJoinAndSelect("chefs.reviews", "reviews", "reviews.status != :rs", {
        rs: "Deleted",
      })
      .leftJoinAndSelect("chefs.items", "items", "items.status != :is", {
        is: "Deleted",
      })
      .leftJoinAndSelect(
        "items.reviews",
        "itemsReviews",
        "itemsReviews.status != :ir",
        {
          ir: "Deleted",
        }
      )
      .leftJoinAndSelect(
        "chefs.orders",
        "orders",
        "orders.order_status != :os",
        {
          os: "Deleted",
        }
      )
      .where(body)
      .andWhere({ status: Not("Deleted") })
      .orderBy("chefs.created_at", "DESC");

  if (offset) {
      query.take(offset.take);
      query.skip(offset.skip);
    }

    let result: any = await query.getManyAndCount();
    let [chefs, count] = result;

    chefs = chefs.map((chef: any) => {
      let completed = chef.orders?.filter(
        (order: any) => order.order_chef_status === OrderChefStatus.COMPLETED
      );

      let chefStars: any = [];
      let items = chef.items?.map((item: any) => {
        let totalReviews = item.reviews?.length;
        let reviewSum = item.reviews.reduce(
          (a: any, b: any) => a + Number(b.star_count),
          0
        );
        let itemStar = reviewSum / totalReviews;
        chefStars.push(itemStar);
        return {
          ...item,
          item_star: itemStar ? itemStar.toFixed(1) : "0",
          item_reviews: totalReviews,
        };
      });
      let reviewsCount = chef.items?.length;

      let chefStarSum = chefStars.reduce((a: any, b: any) => a + Number(b), 0);
      let chefStar = chefStarSum / reviewsCount;
      return {
        ...chef,
        chef_star: chefStar ? chefStar.toFixed(2) : "0",
        chef_reviews: reviewsCount,
        items,
        deliveries: completed?.length,
      };
    });
    res.status(200).json({
      status: 0,
      data: chefs,
      count,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const updateChef = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    full_name,
    user_type,
    bio,
    email,
    mobile,
    drop_off_point_id,
    certificate_number,
    status,
    verified,
  } = req.body;

  let userUpdate = [
    "first_name",
    "middle_name",
    "last_name",
    "full_name",
    "email",
    "mobile",
    "user_type",
  ];

  let chefUpdate = [
    "bio",
    "image",
    "image_key",
    "drop_off_point_id",
    "certificate_number",
    "certificate_file",
    "status",
    "verified",
    "commission",
    "commission_single_change",
  ];

  const keys = Object.keys(req.body);

  let imageKey, imageUrl;
  let certificateKey, certificateUrl;
  try {
    let chef: any = await Chefs.findOne({ where: { id } });

    let image, certificate_file;
    if (req.files) {
      image = req.files.image;
      certificate_file = req.files.certificate_file;
    }

    let imageUploaded = image && image !== "undefined";

    let certificateUploaded =
      certificate_file && certificate_file !== "undefined";

    if (imageUploaded || certificateUploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `${chef.user_id}/avatars/` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (certificateUploaded) {
        let certificateResult = await uploadFile(
          certificate_file[0],
          `${chef.user_id}/certificates/` + certificate_file[0].filename
        );

        if (certificateResult) {
          certificateKey = certificateResult.Key;
          certificateUrl = certificateResult.Location;
        }
        await unlinkAsync(certificate_file[0].path);
      }
    }

    let userValues = keys.filter((value) => userUpdate.includes(value));
    let chefValues = keys.filter((value) => chefUpdate.includes(value));

    if (userValues) {
      await Users.update(
        { id: chef.user_id },
        {
          first_name,
          middle_name,
          last_name,
          full_name,
          email,
          mobile,
          user_type,
        }
      );
    }
    if (chefValues) {
      let bdy: any = {
        bio,
        certificate_number,
        drop_off_point_id,
        status,
        verified,
      };
      if (image) {
        bdy.image = imageUrl;
        bdy.image_key = imageKey;
      }
      if (certificate_file) {
        bdy.certificate_file = certificateUrl;
        bdy.certificate_key = certificateKey;
      }
      await Chefs.update({ id }, bdy);
    }

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

const getChefBydateDistance = async (req: any, res: any, next: any) => {
  const { latitude, longitude, day } = req.query;
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
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  try {
    if (!latitude || !longitude || !day || !days.includes(day)) {
      throw new Error("Invalid request");
    }

    const chefIds = await AppDataSource.query(`SELECT c.id,
      ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC)) ) 
        * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
        * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) AS distance
      FROM chefs c
      JOIN locations l ON c.drop_off_point_id = l.id
      JOIN availabilities a ON a.chef_id = c.id
      INNER JOIN items ON c.id = items.chef_id
      WHERE a.${day} = true AND c.status != 'Deleted' AND c.status != 'Inactive' AND chef.verified=true AND items.id IS NOT NULL AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( CAST(l.latitude AS NUMERIC) ) ) 
        * cos( radians( CAST(l.longitude AS NUMERIC) ) - radians(${longitude}) ) + sin( radians(${latitude}) ) 
        * sin( radians( CAST(l.latitude AS NUMERIC) ) ) ) ) < 50
      ORDER BY distance
      LIMIT ${offset.take} OFFSET ${offset.skip}`);

    let ids = chefIds.map((r: any) => r.id);

    if (ids.length < 1) {
      res.status(200).json({
        status: 0,
        data: [],
      });
      return;
    }
    let chefs: any = await AppDataSource.getRepository(Chefs)
      .createQueryBuilder("chefs")
      .leftJoinAndSelect("chefs.user", "user")
      .leftJoinAndSelect("chefs.items", "items")
      .leftJoinAndSelect("chefs.drop_off_point", "drop_off_point")
      .leftJoinAndSelect("items.reviews", "reviews")
      .leftJoinAndSelect("chefs.availability", "availability")
      .leftJoinAndSelect("chefs.cuisine", "cuisine")
      .leftJoinAndSelect("chefs.spicy_level", "spicy_level")
      .leftJoinAndSelect("chefs.dietry", "dietry")
      .where("chefs.id IN (:...ids)", { ids })
      .getMany();

    chefs = chefs.map((chef: any) => {
      let chefStars: any = [];
      let items = chef.items.map((item: any) => {
        let totalReviews = item.reviews.length;
        let reviewSum = item.reviews.reduce(
          (a: any, b: any) => a + Number(b.star_count),
          0
        );
        let itemStar = reviewSum / totalReviews;
        chefStars.push(itemStar);
        return {
          ...item,
          item_star: itemStar ? itemStar.toFixed(2) : "0",
          item_reviews: totalReviews,
        };
      });
      let reviewsCount = chef.items.length;

      let chefStarSum = chefStars.reduce((a: any, b: any) => a + Number(b), 0);
      let chefStar = chefStarSum / reviewsCount;
      return {
        ...chef,
        chef_star: chefStar ? chefStar.toFixed(2) : "0",
        chef_reviews: reviewsCount,
        items,
      };
    });

    if (!chefs.length) {
      res.status(200).json({
        status: 0,
        data: [],
      });
      return;
    }

    res.status(200).json({
      status: 0,
      data: chefs,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { createChef, getChefs, updateChef, getChefBydateDistance };

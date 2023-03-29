import { AddressType, UserType } from "../helpers/enums";
import { Locations } from "../modules/Locations";
import { Users } from "../modules/User";
import { Customers } from "./../modules/Customers";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
const unlinkAsync = promisify(fs.unlink);
const createCustomer = async (req: any, res: any, next: any) => {
  const {
    user_id,
    first_name,
    middle_name,
    last_name,
    full_name,
    email,
    mobile,
    image,
    terms_accepted,
    address_line_one,
    address_line_two,
    latitude,
    longitude,
    area,
    state,
    city,
    zip_code,
    country,
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

  try {
    let locationValues = keys.filter((value) => locationUpdate.includes(value));

    await Users.update(
      { id: user_id },
      {
        first_name,
        middle_name,
        last_name,
        full_name,
        user_type: UserType.CUSTOMER,
        email,
        mobile,
      }
    );
    let customer;

    customer = Customers.create({
      user_id,
      image,
      terms_accepted,
    });
    await customer.save();

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
        address_type: AddressType.CUSTOMER_ADDRESS,
      });

      await location.save();
    }

    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      customer,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};
const getCustomers = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };

  let body = req.query || { user: null };

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  body = {
    ...body,
    user: { user_type: UserType.CUSTOMER },
  };
  let relations = ["user", "user.locations"];

  if (req.body.includeFollowing) {
    relations.push("user.following");
  }
  if (req.body.includeFollowers) {
    relations.push("user.followers");
  }
  try {
    const customers = await Customers.find({
      where: body,
      ...offset,
      relations,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: customers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateCustomer = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    full_name,
    email,
    mobile,
    user_type,
    image,
    terms_accepted,
  } = req.body;

  let userUpdate = [
    "user_id",
    "first_name",
    "middle_name",
    "last_name",
    "full_name",
    "user_type",
    "email",
    "mobile",
  ];

  let chefUpdate = ["terms_accepted", "image"];

  const keys = Object.keys(req.body);
  let imageKey, imageUrl;
  try {
    let customer: any = await Customers.findOne({ where: { id } });

    const image = req.file;
    let imageUploaded = image && image !== "undefined";
    if (imageUploaded) {
      let imageResult = await uploadFile(
        image[0],
        `${customer.user_id}/avatars/` + image[0].filename
      );

      if (imageResult) {
        imageKey = imageResult.Key;
        imageUrl = imageResult.Location;
      }
      await unlinkAsync(image[0].path);
    }

    let userValues = keys.filter((value) => userUpdate.includes(value));
    let customerValues = keys.filter((value) => chefUpdate.includes(value));

    if (userValues) {
      await Users.update(
        { id: customer.user_id },
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
    if (customerValues) {
      await Customers.update(
        { id },
        { image: imageUrl, image_key: imageKey, terms_accepted }
      );
    }

    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createCustomer, getCustomers, updateCustomer };

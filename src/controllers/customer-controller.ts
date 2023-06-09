import { AddressType, UserType } from "../helpers/enums";
import { Locations } from "../modules/Locations";
import { Users } from "../modules/User";
import { Customers } from "./../modules/Customers";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { Not } from "typeorm";
import { AppDataSource } from "../";
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
    const customerData = await Customers.findOne({
      where: { user_id },
    });

    if (customerData) {
      await Users.update(
        { id: user_id },
        {
          user_type: UserType.CUSTOMER,
        }
      );
      res.status(201).json({
        status: 0,
        message: "Customer is already exist",
        customerData,
      });
      return;
    }

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
    if (
      !latitude ||
      latitude === "" ||
      latitude === "null" ||
      !longitude ||
      longitude === "" ||
      longitude === "null"
    ) {
      throw new Error("Invalid location");
    }
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
  let body: any = {};

  body = {
    ...body,
    ...req.query,
  };

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }

  try {
    let query = AppDataSource.getRepository(Customers)
      .createQueryBuilder("customers")
      .leftJoinAndSelect("customers.user", "user")
      .leftJoinAndSelect("user.locations", "locations")
      .where(body)
      .andWhere({ status: Not("Deleted") })
      .orderBy("customers.created_at", "DESC");

    if (offset) {
      query.take(offset.take);
      query.skip(offset.skip);
    }

    let result: any = await query.getManyAndCount();
    let [customers, count] = result;

    res.status(200).json({
      status: 0,
      data: customers,
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
    terms_accepted,
    status,
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
        image,
        `${customer.user_id}/avatars/` + image.filename
      );

      if (imageResult) {
        imageKey = imageResult.Key;
        imageUrl = imageResult.Location;
      }
      await unlinkAsync(image.path);
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
        { image: imageUrl, image_key: imageKey, terms_accepted, status }
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
      message: error.message,
    });
  }
};

export default { createCustomer, getCustomers, updateCustomer };

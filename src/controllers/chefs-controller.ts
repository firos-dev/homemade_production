import { UserType } from './../helpers/enums';
import { AddressType } from "../helpers/enums";
import { Locations } from "../modules/Locations";
import { Users } from "../modules/User";
import { Chefs } from "./../modules/Chefs";

const createChef = async (req: any, res: any, next: any) => {
  const {
    user_id,
    first_name,
    middle_name,
    last_name,
    full_name,
    bio,
    image,
    cuisine_id,
    dietry_id,
    spicy_level_id,
    description,
    terms_accepted,
    drop_off_point_id,
    certificate_file,
    certificate_number,
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

  let userUpdate = ["first_name", "middle_name", "last_name", "full_name"];
  let chefCreate = [
    "bio",
    "image",
    "cuisine_id",
    "dietry_id",
    "spicy_level_id",
    "description",
    "terms_accepted",
    "drop_off_point_id",
    "certificate_file",
    "certificate_number",
  ];
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
    let userValues = keys.filter((value) => userUpdate.includes(value));
    let chefValues = keys.filter((value) => chefCreate.includes(value));
    let locationValues = keys.filter((value) => locationUpdate.includes(value));

    if (userValues.length) {
      await Users.update(
        { id: user_id },
        { first_name, middle_name, last_name, full_name, user_type: UserType.CHEF }
      );
    }
    let chef;
    if (chefValues.length) {
      chef = Chefs.create({
        user_id,
        bio,
        image,
        cuisine_id,
        dietry_id,
        spicy_level_id,
        description,
        terms_accepted,
        drop_off_point_id,
        certificate_file,
        certificate_number,
      });
      await chef.save();
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
        address_type: AddressType.SERVICE_ADDRES,
      });

      await location.save();
    }

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

  let body = req.query;

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  try {
    const chefs = await Chefs.find({
      where: body,
      ...offset,
      relations: ["user", "cuisine", "spicy_level", "dietry", "user.locations"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: chefs,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
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
    bio,
    image,
    email,
    mobile,
    drop_off_point,
    certificate_number,
    certificate_file,
  } = req.body;

  let userUpdate = [
    "first_name",
    "middle_name",
    "last_name",
    "full_name",
    "email",
    "mobile",
    "certificate_number",
    "certificate_file",
  ];

  let chefUpdate = ["bio", "image", "drop_off_point"];

  const keys = Object.keys(req.body);

  try {
    let chef: any = await Chefs.findOne({ where: { id } });

    let userValues = keys.filter((value) => userUpdate.includes(value));
    let chefValues = keys.filter((value) => chefUpdate.includes(value));

    if (userValues) {
      await Users.update(
        { id: chef.user_id },
        { first_name, middle_name, last_name, full_name, email, mobile }
      );
    }
    if (chefValues) {
      await Chefs.update(
        { id },
        { bio, image, certificate_number, certificate_file, drop_off_point }
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

export default { createChef, getChefs, updateChef };

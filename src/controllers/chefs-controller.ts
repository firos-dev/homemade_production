import { UserType } from "./../helpers/enums";
import { AddressType } from "../helpers/enums";
import { Locations } from "../modules/Locations";
import { Users } from "../modules/User";
import { Chefs } from "./../modules/Chefs";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
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
    let chef;
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
  let body: any = {
    user: { user_type: UserType.CHEF },
  };

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
  ];

  if (req.body.includeFollowing) {
    relations.push("user.following");
  }
  if (req.body.includeFollowers) {
    relations.push("user.followers");
  }

  try {
    const chefs = await Chefs.find({
      where: body,
      ...offset,
      relations: relations,
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

export default { createChef, getChefs, updateChef };

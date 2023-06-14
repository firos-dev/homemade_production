import { AddressType } from "./../helpers/enums";
import { Users } from "../modules/User";
import { DeliveryPartners } from "../modules/DeliveryPartners";
import { UserType } from "../helpers/enums";
import { Locations } from "../modules/Locations";
import uploadFile from "../helpers/s3";
import { promisify } from "util";
import fs from "fs";
import { AppDataSource } from "../";
import { Not } from "typeorm";
const unlinkAsync = promisify(fs.unlink);

const createDeliveryPartner = async (req: any, res: any, next: any) => {
  const {
    user_id,
    first_name,
    middle_name,
    last_name,
    full_name,
    email,
    terms_accepted,
    licence_number,
    address_line_one,
    address_line_two,
    latitude,
    longitude,
    area,
    state,
    city,
    zip_code,
    country,
    car_registration,
    nationality,
  } = req.body;

  let userUpdate = [
    "user_id",
    "first_name",
    "middle_name",
    "last_name",
    "full_name",
    "email",
  ];
  let deliverPartnerCreate = [
    "image",
    "terms_accepted",
    "licence_file",
    "licence_number",
    "car_registration",
    "nationality",
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
  ];
  const keys = Object.keys(req.body);
  let imageKey, imageUrl;
  let licenceFrontKey, licenceFrontUrl;
  let licenceBackKey, licenceBackUrl;
  let carFrontKey, carBackUrl;
  let carBackKey, carFrontUrl;
  let idCardFrontKey, idCardFrontUrl;
  let idCardBackKey, idCardBackUrl;

  try {
    const {
      image,
      licence_front,
      licence_back,
      car_front_image,
      car_back_image,
      id_card_front,
      id_card_back,
    } = req.files;

    let imageUploaded = image && image !== "undefined";
    let licenceFrontUploaded = licence_front && licence_front !== "undefined";
    let licenceBackUploaded = licence_back && licence_back !== "undefined";
    let carFrontUploaded = car_front_image && car_front_image !== "undefined";
    let carBackUploaded = car_back_image && car_back_image !== "undefined";
    let idCardFrontUploaded = id_card_front && id_card_front !== "undefined";
    let idCardBackUploaded = id_card_back && id_card_back !== "undefined";

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

    if (licenceFrontUploaded) {
      let licenceFrontResult = await uploadFile(
        licence_front[0],
        `${user_id}/certificates/` + licence_front[0].filename
      );

      if (licenceFrontResult) {
        licenceFrontKey = licenceFrontResult.Key;
        licenceFrontUrl = licenceFrontResult.Location;
      }
      await unlinkAsync(licence_front[0].path);
    }

    if (licenceBackUploaded) {
      let licenceBackResult = await uploadFile(
        licence_back[0],
        `${user_id}/certificates/` + licence_back[0].filename
      );

      if (licenceBackResult) {
        licenceBackKey = licenceBackResult.Key;
        licenceBackUrl = licenceBackResult.Location;
      }
      await unlinkAsync(licence_back[0].path);
    }

    if (carFrontUploaded) {
      let carFrontResult = await uploadFile(
        car_front_image[0],
        `${user_id}/car_images/` + car_front_image[0].filename
      );

      if (carFrontResult) {
        carFrontKey = carFrontResult.Key;
        carFrontUrl = carFrontResult.Location;
      }
      await unlinkAsync(car_front_image[0].path);
    }

    if (carBackUploaded) {
      let carBackResult = await uploadFile(
        car_back_image[0],
        `${user_id}/car_images/` + car_back_image[0].filename
      );

      if (carBackResult) {
        carBackKey = carBackResult.Key;
        carBackUrl = carBackResult.Location;
      }
      await unlinkAsync(car_back_image[0].path);
    }

    if (idCardFrontUploaded) {
      let idCardFrontResult = await uploadFile(
        id_card_front[0],
        `${user_id}/id_cards/` + id_card_front[0].filename
      );

      if (idCardFrontResult) {
        idCardFrontKey = idCardFrontResult.Key;
        idCardFrontUrl = idCardFrontResult.Location;
      }
      await unlinkAsync(id_card_front[0].path);
    }

    if (idCardBackUploaded) {
      let idCardBackResult = await uploadFile(
        id_card_back[0],
        `${user_id}/certificates/` + id_card_back[0].filename
      );

      if (idCardBackResult) {
        idCardBackKey = idCardBackResult.Key;
        idCardBackUrl = idCardBackResult.Location;
      }
      await unlinkAsync(id_card_back[0].path);
    }

    let userValues = keys.filter((value) => userUpdate.includes(value));
    let deliveryPartnerValues = keys.filter((value) =>
      deliverPartnerCreate.includes(value)
    );
    let locationValues = keys.filter((value) => locationUpdate.includes(value));

    if (userValues.length) {
      await Users.update(
        { id: user_id },
        {
          first_name,
          middle_name,
          last_name,
          full_name,
          email,
          user_type: UserType.DELIVERY_PARTNER,
        }
      );
    }
    let chef;
    if (deliveryPartnerValues.length) {
      chef = DeliveryPartners.create({
        user_id,
        image: imageUrl,
        image_key: imageKey,
        terms_accepted,
        licence_front: licenceFrontUrl,
        licence_front_key: licenceBackKey,
        id_card_front: idCardFrontUrl,
        id_card_front_key: idCardFrontKey,
        id_card_back: idCardBackUrl,
        id_card_back_key: idCardBackKey,
        car_front_image: carFrontUrl,
        car_front_image_key: carFrontKey,
        car_back_image: carBackUrl,
        car_back_image_key: carBackKey,
        licence_number,
      });
      await chef.save();
    }
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
        address_type: AddressType.SERVICE_ADDRES,
      });

      await location.save();
    }

    console.log(req.body);

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

const getDeliveryPartners = async (req: any, res: any, next: any) => {
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
    let query = AppDataSource.getRepository(DeliveryPartners)
      .createQueryBuilder("delivery")
      .leftJoinAndSelect("delivery.user", "user")
      .leftJoinAndSelect("user.locations", "locations")
      .leftJoinAndSelect("delivery.reviews", "reviews")
      .leftJoinAndSelect("delivery.orders", "orders")
      .where(body)
      .andWhere({ status: Not("Deleted") })
      .orderBy("delivery.created_at", "DESC");

    if (offset) {
      query.take(offset.take);
      query.skip(offset.skip);
    }

    let result: any = await query.getManyAndCount();
    let [delivery, count] = result;

    res.status(200).json({
      status: 0,
      data: delivery,
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

const updateDeliveryPartnerUser = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const {
    first_name,
    middle_name,
    last_name,
    full_name,
    email,
    mobile,
    image,
    terms_accepted,
    licence_file,
    licence_number,
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
  ];

  let deliveryPartnerUpdate = [
    "image",
    "terms_accepted",
    "licence_file",
    "licence_number",
    "status",
    "verified",
  ];

  const keys = Object.keys(req.body);
  let imageKey, imageUrl;
  let licenceKey, licenceUrl;
  try {
    let deliveryPartner: any = await DeliveryPartners.findOne({
      where: { id },
    });

    const { image, licence_file } = req.files;

    let imageUploaded = image && image !== "undefined";

    let licenceUploaded = licence_file && licence_file !== "undefined";

    if (imageUploaded || licenceUploaded) {
      if (imageUploaded) {
        let imageResult = await uploadFile(
          image[0],
          `${deliveryPartner.user_id}/avatars/` + image[0].filename
        );

        if (imageResult) {
          imageKey = imageResult.Key;
          imageUrl = imageResult.Location;
        }
        await unlinkAsync(image[0].path);
      }
      if (licenceUploaded) {
        let licenceResult = await uploadFile(
          licence_file[0],
          `${deliveryPartner.user_id}/certificates/` + licence_file[0].filename
        );

        if (licenceResult) {
          licenceKey = licenceResult.Key;
          licenceUrl = licenceResult.Location;
        }
        await unlinkAsync(licence_file[0].path);
      }
    }

    let userValues = keys.filter((value) => userUpdate.includes(value));
    let deliveryPartnerValues = keys.filter((value) =>
      deliveryPartnerUpdate.includes(value)
    );

    if (userValues) {
      await Users.update(
        { id: deliveryPartner.user_id },
        { first_name, middle_name, last_name, full_name, email, mobile }
      );
    }
    if (deliveryPartnerValues) {
      let bdy: any = {
        image,
        terms_accepted,
        licence_file,
        licence_number,
        status,
        verified,
      };
      if (image) {
        bdy.image = imageUrl;
        bdy.image_key = imageKey;
      }
      if (licence_file) {
        bdy.licence_file = licenceUrl;
        bdy.licence_key = licenceKey;
      }

      await DeliveryPartners.update({ id }, bdy);
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

const updateDeliveryPartner = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await DeliveryPartners.update({ id: id }, { ...req.body });

    res.status(200).json({
      success: 0,
      message: "Your changes has been successfully saved.",
    });
  } catch (e) {
    console.log(e);

    res.status(400).json({
      success: 1,
      message: e.message,
    });
  }
};

export default {
  createDeliveryPartner,
  getDeliveryPartners,
  updateDeliveryPartner,
  updateDeliveryPartnerUser,
};

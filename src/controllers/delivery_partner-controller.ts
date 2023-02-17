import { AddressType } from "./../helpers/enums";
import { Users } from "../modules/User";
import { DeliveryPartners } from "../modules/DeliveryPartners";
import { UserType } from "../helpers/enums";
import { Locations } from "../modules/Locations";

const createDeliveryPartner = async (req: any, res: any, next: any) => {
  const {
    user_id,
    first_name,
    middle_name,
    last_name,
    full_name,
    email,
    image,
    terms_accepted,
    licence_file,
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

  try {
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
        image,
        terms_accepted,
        licence_file,
        licence_number,
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

const getDeliveryPartners = async (req: any, res: any, next: any) => {
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
    const chefs = await DeliveryPartners.find({
      where: body,
      ...offset,
      relations: ["user", "orders", "user.locations"],
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
  ];

  const keys = Object.keys(req.body);

  try {
    let deliveryPartner: any = await DeliveryPartners.findOne({
      where: { id },
    });

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
      await DeliveryPartners.update(
        { id },
        {
          image,
          terms_accepted,
          licence_file,
          licence_number,
        }
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

const updateDeliveryPartner = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "image",
    "terms_accepted",
    "licence_file",
    "licence_number",
    "online",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidOperation) {
      throw new Error("Invalid updates!");
    }

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

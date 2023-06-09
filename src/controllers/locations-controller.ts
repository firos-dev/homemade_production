import { AddressType, Status } from "../helpers/enums";
import { Locations } from "../modules/Locations";

const createLocation = async (req: any, res: any, next: any) => {
  const {
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
    label_address,
    building_name,
    floor_number,
    door_number,
    landmark,
    contact_number,
    address_type,
  } = req.body;
  try {
    if (!user_id) {
      throw new Error("Please provide user ID");
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
      label_address,
      building_name,
      floor_number,
      door_number,
      landmark,
      contact_number,
      address_type,
    });
    await location.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const updateLocaion = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    if (!Object.keys(req.body).length) {
      throw new Error("No updates found");
    }
    if (
      (req.body.latitude && req.body.latitude === "") ||
      req.body.latitude === "null" ||
      (req.body.longitude && req.body.longitude === "") ||
      req.body.longitude === "null"
    ) {
      throw new Error("Invalid location");
    }
    await Locations.update({ id }, { ...req.body });
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const getLocations = async (req: any, res: any, next: any) => {
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
    const location = await Locations.find({
      where: body,
      ...offset,
      relations: ["user"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: location,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const createDropOffPoint = async (req: any, res: any, next: any) => {
  const {
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
  try {
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
    const location = Locations.create({
      address_line_one,
      address_line_two,
      latitude,
      longitude,
      area,
      state,
      city,
      zip_code,
      country,
      address_type: AddressType.DROP_OFF_ADDRES,
    });
    await location.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getDropOffPoints = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };

  let body = req.query;
  body = {
    ...body,
    address_type: AddressType.DROP_OFF_ADDRES,
  };

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }
  try {
    const location = await Locations.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: location,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default {
  updateLocaion,
  createLocation,
  getLocations,
  createDropOffPoint,
  getDropOffPoints,
};

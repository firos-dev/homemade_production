import { AppDataSource } from "./../index";
import { Availabilities } from "../modules/Availabilities";

const createAvailabilites = async (req: any, res: any, next: any) => {
  const {
    chef_id,
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
  } = req.body;
  try {
    if (!chef_id) {
      throw new Error("Please provide chef_id");
    }
    const avail = Availabilities.create({
      chef_id,
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
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getAvailabilities = async (req: any, res: any, next: any) => {
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
    const availabilities = await Availabilities.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: availabilities,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateAvailability = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Please provide id as params");
    }
    if (!Object.keys(req.body).length) {
      throw new Error("No updates found");
    }
    await Availabilities.update({ id }, req.body);
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

export default {
  createAvailabilites,
  getAvailabilities,
  updateAvailability,
};

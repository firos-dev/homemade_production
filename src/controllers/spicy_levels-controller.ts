import { Status } from "../helpers/enums";
import { SpicyLevels } from "./../modules/SpicyLevels";
const createSpicyLevel = async (req: any, res: any, next: any) => {
  try {
    const spicyLevel = SpicyLevels.create(req.body);
    await spicyLevel.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: spicyLevel,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getSpicyLevels = async (req: any, res: any, next: any) => {
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
    const spicyLevels = await SpicyLevels.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: spicyLevels,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { createSpicyLevel, getSpicyLevels };

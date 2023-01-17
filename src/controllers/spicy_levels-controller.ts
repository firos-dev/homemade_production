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
  try {
    const spicyLevels = await SpicyLevels.find({
      where: { status: Status.ACTIVE },
    });
    res.status(200).json({
      status: 0,
      data: spicyLevels,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createSpicyLevel, getSpicyLevels };

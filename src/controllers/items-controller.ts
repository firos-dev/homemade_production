import { Status } from "src/helpers/enums";
import { Items } from "../modules/Items";

const createItem = async (req: any, res: any, next: any) => {
  try {
    const item = Items.create(req.body);
    await item.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getItems = async (req: any, res: any, next: any) => {
  try {
    const dietries = await Items.find({
      where: { status: Status.ACTIVE },
    });
    res.status(200).json({
      status: 0,
      data: dietries,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createItem, getItems };

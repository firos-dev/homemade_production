import { Status } from "../helpers/enums";
import { Cuisines } from "../modules/Cuisines";

const createCuisine = async (req: any, res: any, next: any) => {
  try {
    const cuisine = Cuisines.create(req.body);
    await cuisine.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: cuisine,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCuisines = async (req:any, res:any, next:any) => {
  try {
    const cuisines = await Cuisines.find({where: {status: Status.ACTIVE}})
    res.status(200).json({
      status: 0,
      data: cuisines,
    });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
}

export default { createCuisine, getCuisines };

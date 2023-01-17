import { Status } from "../helpers/enums";
import { Dietries } from "../modules/Dietries";

const createDietry = async (req: any, res: any, next: any) => {
    try {
      const dietry = Dietries.create(req.body);
      await dietry.save();
      res.status(201).json({
        status: 0,
        message: "Record has been successfully saved",
        data: dietry,
      });
    } catch (error) {
      res.status(400).json({
        status: 0,
        message: error.message,
      });
    }
  };

  const getDietries= async (req: any, res: any, next: any) => {
    try {
      const dietries = await Dietries.find({
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

  export default {createDietry, getDietries}


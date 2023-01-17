import { Status } from "src/helpers/enums";
import { Locations } from "src/modules/Locations";

const createLocation = async (req: any, res: any, next: any) => {
  try {
    const location = Locations.create(req.body);
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

const getLocations = async (req: any, res: any, next: any) => {
  try {
    const location = await Locations.find();
    res.status(200).json({
      status: 0,
      data: location,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createLocation, getLocations };

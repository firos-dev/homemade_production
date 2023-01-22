import { Chefs } from "./../modules/Chefs";

const createChef = async (req: any, res: any, next: any) => {
  try {
    const chef = Chefs.create(req.body);
    await chef.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: chef,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
    
  }
};

const getChefs = async (req: any, res: any, next: any) => {
  try {
    const chefs = await Chefs.find();
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

export default { createChef, getChefs };

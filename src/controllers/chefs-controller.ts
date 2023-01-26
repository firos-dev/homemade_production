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
    const chefs = await Chefs.find({
      where: body,
      ...offset,
      relations: ["user", "cuisine", "spicy_level", "dietry"],
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

const updateChef = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    const chef = await Chefs.update({ id }, { ...req.body });
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
      data: chef,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createChef, getChefs, updateChef };

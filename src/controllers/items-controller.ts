import { Items } from "../modules/Items";

const createItem = async (req: any, res: any, next: any) => {
  const {
    chef_id,
    cuisine_id,
    name,
    unit,
    portion_size,
    price,
    image,
    available,
    description,
    ingredients,
    allergic_ingredients,
    type,
    status,
  } = req.body;
  try {
    const item = Items.create({
      chef_id,
      cuisine_id,
      name,
      unit,
      portion_size,
      price,
      image,
      available,
      description,
      ingredients,
      allergic_ingredients,
      type,
      status,
    });
    if (!chef_id) {
      throw new Error("Chef ID required");
    }
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
    const items = await Items.find({
      where: body,
      ...offset,
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: items,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateItem = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    if (!Object.keys(req.body).length) {
      throw new Error("No updates found");
    }
    await Items.update({ id }, { ...req.body });
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

export default { createItem, getItems, updateItem };

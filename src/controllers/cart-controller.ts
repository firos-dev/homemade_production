import { Cart } from "../modules/Cart";

const addToCart = async (req: any, res: any, next: any) => {
  try {
    if (!req.body.user_id) {
      throw new Error("User id is missing");
    }
    if (!req.body.item_id) {
      throw new Error("Item is missing");
    }
    const cart = Cart.create(req.body);
    await cart.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: cart.id,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCart = async (req: any, res: any, next: any) => {
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
    const cart = await Cart.find({
      where: body,
      ...offset,
      relations: ["user", "item"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: cart,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const updateCart = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await Cart.update({ id }, req.body);
    res.status(200).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const deleteCart = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await Cart.delete({ id });
    res.status(200).json({
      status: 0,
      message: "Record has been successfully deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { addToCart, getCart, updateCart, deleteCart };

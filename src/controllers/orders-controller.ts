import { AppDataSource } from "./../index";
import { Orders } from "./../modules/Orders";
import {
  OrderChefStatus,
  OrderDeliveryStatus,
  OrderStatus,
} from "../helpers/enums";
import { OrderItems } from "../modules/OrderItems";

const createOrder = async (req: any, res: any, next: any) => {
  const { user_id, delivery_charge, discound_amount, offer_amount, items } =
    req.body;
  try {
    if (!user_id) {
      throw new Error("Chef ID required");
    }

    const order = Orders.create({
      user_id,
      delivery_charge,
      discound_amount,
      offer_amount,
      order_status: OrderStatus.CREATED,
      order_chef_status: OrderChefStatus.RECIEVED,
      order_delivery_status: OrderDeliveryStatus.RECIEVED,
    });

    await order.save().then(async (data: any) => {
      const orderItems: any = items.map((item: any) => {
        return {
          ...item,
          order_id: order.id,
        };
      });
      await AppDataSource.getRepository(OrderItems)
        .createQueryBuilder()
        .insert()
        .into(OrderItems)
        .values(orderItems)
        .execute();
    });

    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getOrders = async (req: any, res: any, next: any) => {
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
    const orders = await Orders.find({
      where: body,
      ...offset,
      relations: ["items", "user"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createOrder, getOrders };

import { AppDataSource } from "./../index";
import { Orders } from "./../modules/Orders";
import {
  OrderChefStatus,
  OrderDeliveryStatus,
  OrderStatus,
} from "../helpers/enums";
import { OrderItems } from "../modules/OrderItems";
import { Between } from "typeorm";
import { io } from "./../index";

const createOrder = async (req: any, res: any, next: any) => {
  const {
    user_id,
    delivery_charge,
    discound_amount,
    offer_amount,
    items,
    chef_id,
    delivery_date,
    delivery_time,
    delivery_location_id,
  } = req.body;
  try {
    if (!user_id) {
      throw new Error("Chef ID required");
    }

    const order = Orders.create({
      user_id,
      chef_id,
      delivery_charge,
      delivery_date,
      delivery_time,
      discound_amount,
      offer_amount,
      order_status: OrderStatus.CREATED,
      order_chef_status: OrderChefStatus.RECIEVED,
      delivery_location_id,
    });

    await order.save().then(async () => {
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
    io.emit("create_order", { data: order });
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

  let where = body;

  if (req.body.from) {
    where = {
      ...where,
      delivery_date: Between(new Date(req.body.from), new Date(req.body.to)),
    };
  }

  try {
    let orders: any = await Orders.find({
      where: { ...where },
      ...offset,
      relations: [
        "items",
        "user",
        "delivery_location",
        "chef",
        "chef.drop_off_point",
        "chef.user",
        "logs",
      ],
      order: { created_at: "DESC" },
    });
    orders = orders.map((order: any) => {
      return {
        ...order,
        payments: [
          {
            amount: "3423.00",
            date: "2023-04-15",
            time: "13:25:00",
            payment_method: "Card",
          },
        ],
      };
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

const updateOrder = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    await Orders.update({ id }, req.body);

    res.status(200).json({
      status: 0,
      message: "Record has been succefully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const getCurrentOrder = async (req: any, res: any, next: any) => {
  const { delivery_partner_id } = req.query;
  try {
    let whereClause: any = [
      { delivery_partner_id, order_delivery_status: "Accepted" },
      { delivery_partner_id, order_delivery_status: "Ready to pick" },
      { delivery_partner_id, order_delivery_status: "Collected" },
      { delivery_partner_id, order_delivery_status: "Ready to drop" },
    ];
    const delivery = await Orders.find({
      where: whereClause,
      relations: [
        "items",
        "user",
        "delivery_location",
        "chef",
        "chef.drop_off_point",
        "chef.user",
        "logs",
      ],
    });
    res.status(200).json({
      status: 0,
      data: delivery,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const getDeliveriesCount = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: {
        count: 70,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default {
  createOrder,
  getOrders,
  updateOrder,
  getCurrentOrder,
  getDeliveriesCount,
};

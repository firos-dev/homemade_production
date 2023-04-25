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
import { Chefs } from "./../modules/Chefs";
import { sendNotification } from "./../helpers/notification";

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
    instructions,
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
      instructions,
    });

    const chef: any = await Chefs.findOne({
      where: { id: chef_id },
      relations: ["user"],
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
    // io.emit("create_order", { data: order });
    const user = chef.user;
    const title = "New Order";
    const body = `You have a new order to prepare.
    
    Thank you for your hard work and dedication to providing exceptional food and service.
    
    Best regards,
    
    Homemade Management`;
    sendNotification({ user, title, body });
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
    const order: any = await Orders.findOne({
      where: { id },
      relations: [
        "user",
        "chef",
        "chef.user",
        "delivery_partner",
        "delivery_partner.user",
      ],
    });
    const updateResult = await AppDataSource.getRepository(Orders)
      .createQueryBuilder()
      .update(Orders)
      .set(req.body)
      .where("id = :id", { id })
      .returning("*") // '*' means all columns of the updated rows
      .execute();

    let updatedRows = updateResult.raw;
    io.emit("order_updated", { order: updatedRows });
    if (
      req.body.order_status === "Preparing" &&
      order.order_status !== "Preparing"
    ) {
      const user = order.user;
      const title = "Started Preparing";
      const body = `Your order is started to preparing`;
      sendNotification({ user, title, body });
    }

    if (
      req.body.order_status === "Cancelled" &&
      order.order_status !== "Cancelled"
    ) {
      const title = "Cancelled";
      const body = `Your order ${order.order_ref_id} has been cancelled`;
      sendNotification({ user: order.user, title, body });
      sendNotification({ user: order.chef.user, title, body });
      if (order.delivery_partner_id) {
        sendNotification({ user: order.delivery_partner.user, title, body });
      }
    }

    if (
      req.body.order_status === "Processing" &&
      order.order_status !== "Processing"
    ) {
      const title = "Ready to delivery";
      const body = `Your order ${order.order_ref_id} is ready to be delivered`;
      sendNotification({ user: order.user, title, body });
      sendNotification({ user: order.chef.user, title, body });
    }

    if (
      req.body.order_status === "Processing" &&
      order.order_status !== "Processing"
    ) {
      const title = "Ready to pick";
      const body = `Your order ${order.order_ref_id} is ready to be delivered`;
      sendNotification({ user: order.user, title, body });
      sendNotification({ user: order.chef.user, title, body });
    }

    if (
      req.body.order_status === "Completed" &&
      order.order_status !== "Completed"
    ) {
      const title = "Order Delivered";
      const body = `Your order ${order.order_ref_id} has been successfully delivered`;
      sendNotification({ user: order.user, title, body });
      sendNotification({ user: order.chef.user, title, body });
    }

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
  const { delivery_partner_id, chef_id, user_id } = req.query;
  try {
    let whereClause: any;
    if (delivery_partner_id) {
      whereClause = [
        { delivery_partner_id, order_delivery_status: "Accepted" },
        { delivery_partner_id, order_delivery_status: "Ready to pick" },
        { delivery_partner_id, order_delivery_status: "Collected" },
        { delivery_partner_id, order_delivery_status: "Ready to drop" },
      ];
    } else if (chef_id) {
      whereClause = [
        { chef_id, order_chef_status: "Accepted" },
        { chef_id, order_chef_status: "Preparing" },
        { chef_id, order_chef_status: "Ready" },
      ];
    } else if (user_id) {
      whereClause = [
        { user_id, order_status: "Preparing" },
        { user_id, order_status: "Processing" },
      ];
    } else {
      whereClause = [
        { order_delivery_status: "Accepted" },
        { order_delivery_status: "Ready to pick" },
        { order_delivery_status: "Collected" },
        { order_delivery_status: "Ready to drop" },
      ];
    }
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

const getAllOrders = async (req: any, res: any, next: any) => {
  const { delivery_partner_id, chef_id, user_id } = req.query;
  try {
    let whereClause: any = [
      { chef_id, order_chef_status: "Recieved" },
      { chef_id, order_chef_status: "Accepted" },
      { chef_id, order_chef_status: "Preparing" },
      { chef_id, order_chef_status: "Ready" },
    ];
    const orders = await Orders.find({
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

const getLastReviewPending = async (req: any, res: any, next: any) => {
  const { customer_id } = req.params;
  try {
    const order = await Orders.find({
      where: { reviewed: false },
      order: { updated_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: order?.[0],
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
  getLastReviewPending,
  getAllOrders,
};

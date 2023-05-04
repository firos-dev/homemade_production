import { AppDataSource } from "../";
import { Orders } from "../modules/Orders";
import { Between } from "typeorm";
import moment from "moment";
import { Chefs } from "../modules/Chefs";
import { DeliveryPartners } from "../modules/DeliveryPartners";
import { Items } from "../modules/Items";
import { Customers } from "../modules/Customers";

const getCounts = async (req: any, res: any, next: any) => {
  let startDate = moment().format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");

  if (req.query.startDate) {
    startDate = req.query.startDate;
    endDate = req.query.endDate;
  }

  const day = moment().format("dddd").toLowerCase();

  try {
    const orderCount = await AppDataSource.getRepository(Orders)
      .createQueryBuilder("orders")
      .where({ delivery_date: Between(startDate, endDate) })
      .getCount();

    const chefsOnline = await AppDataSource.getRepository(Chefs)
      .createQueryBuilder("chefs")
      .leftJoinAndSelect("chefs.availability", "availability")
      .where(`availability.${day} = :bool`, { bool: true })
      .getCount();

    const delveryOnline = await AppDataSource.getRepository(DeliveryPartners)
      .createQueryBuilder("delivery")
      .where(`delivery.online = :bool`, { bool: true })
      .getCount();

    const itemsAvailable = await AppDataSource.getRepository(Items)
      .createQueryBuilder("items")
      .leftJoinAndSelect("items.chef", "chef")
      .leftJoinAndSelect("chef.availability", "availability")
      .where(`availability.${day} = :bool`, { bool: true })
      .getCount();

    res.status(200).json({
      status: 0,
      data: {
        orders: orderCount,
        chefOnline: chefsOnline,
        deliveryPartners: delveryOnline,
        itemsAvailable: itemsAvailable,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const getRecentData = async (req: any, res: any, next: any) => {
  const count = req.query.count || null;

  try {
    if (!count) {
      throw new Error("Invalid request");
    }
    const offset = {
      skip: 0,
      take: Number(count),
    };

    let chefs = await AppDataSource.getRepository(Chefs)
      .createQueryBuilder("chefs")
      .leftJoinAndSelect("chefs.user", "user")
      .where("chefs.status != :cs", { cs: "Deleted" })
      .orderBy("chefs.created_at", "DESC")
      .take(offset.take)
      .skip(offset.skip)
      .getMany();

    let customers = await AppDataSource.getRepository(Customers)
      .createQueryBuilder("customers")
      .leftJoinAndSelect("customers.user", "user")
      .where("customers.status != :us", { us: "Deleted" })
      .orderBy("customers.created_at", "DESC")
      .take(offset.take)
      .skip(offset.skip)
      .getMany();

    let orders = await AppDataSource.getRepository(Orders)
      .createQueryBuilder("orders")
      .leftJoinAndSelect("orders.user", "user")
      .leftJoinAndSelect("orders.chef", "chef")
      .leftJoinAndSelect("orders.delivery_location", "delivery_location")
      .where("orders.order_status != :os", { os: "Deleted" })
      .orderBy("orders.created_at", "DESC")
      .take(offset.take)
      .skip(offset.skip)
      .getMany();

    let items = await AppDataSource.getRepository(Items)
      .createQueryBuilder("items")
      .leftJoinAndSelect("items.chef", "chef")
      .where("items.status != :is", { is: "Deleted" })
      .orderBy("items.created_at", "DESC")
      .take(offset.take)
      .skip(offset.skip)
      .getMany();

    res.status(200).json({
      status: 0,
      data: {
        chefs,
        orders,
        customers,
        items,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { getCounts, getRecentData };

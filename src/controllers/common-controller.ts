import { AppDataSource } from "../";
import { Orders } from "../modules/Orders";
import { Between } from "typeorm";
import moment from "moment";
import { Chefs } from "../modules/Chefs";
import { DeliveryPartners } from "../modules/DeliveryPartners";
import { Items } from "../modules/Items";

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
      message: error.messages,
    });
  }
};


const getRecentData = async (req: any, res: any, next: any) => {
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
      let chefs = await Chefs.find({
        where: body,
        ...offset,
        relations:["user"],
        order: { created_at: "DESC" },
      });
  
      res.status(200).json({
        status: 0,
        data: {
            chefs: chefs
        },
      });
    } catch (error) {
      console.log(error);
  
      res.status(400).json({
        status: 1,
        message: error.messages,
      });
    }
  }

export default { getCounts,getRecentData };

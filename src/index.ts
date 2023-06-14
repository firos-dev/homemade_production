import express, { NextFunction, Request, Response } from "express";
import http from "http";
import fs from "fs";
import { Server } from "socket.io";
import { DataSource } from "typeorm";
import { Users } from "./modules/User";
import { userRouter } from "./routes/user";
import { cuisineRouter } from "./routes/cuisines";
import { Cuisines } from "./modules/Cuisines";
import { OtpMaster } from "./modules/OtpMaster";
import { roleRouter } from "./routes/roles";
import { Roles } from "./modules/Roles";
import { spicyLevelRouter } from "./routes/spicy_levels";
import { dietriesRouter } from "./routes/dietries";
import { customerRouter } from "./routes/customers";
import { deliveryPartnersRouter } from "./routes/delivery_partners";
import { SpicyLevels } from "./modules/SpicyLevels";
import { chefsRouter } from "./routes/chefs";
import { Locations } from "./modules/Locations";
import { locationsRouter } from "./routes/locations";
import { Availabilities } from "./modules/Availabilities";
import { Chefs } from "./modules/Chefs";
import { Customers } from "./modules/Customers";
import { DeliveryPartners } from "./modules/DeliveryPartners";
import { Dietries } from "./modules/Dietries";
import { availabilitiesRouter } from "./routes/availabilities";
import { Items } from "./modules/Items";
import { itemsRouter } from "./routes/items";
import { Cart } from "./modules/Cart";
import { Orders } from "./modules/Orders";
import { OrderItems } from "./modules/OrderItems";
import { cartRouter } from "./routes/cart";
import { orderRouter } from "./routes/orders";
import { setCommonHeaders } from "./helpers/cors";
import { Followers } from "./modules/Followers";
import { followersRouter } from "./routes/followers";
import { OrderLogs } from "./modules/OrderLogs";
import { orderLogsRouter } from "./routes/order_logs";
import { Reviews } from "./modules/Reviews";
import { reviewRouter } from "./routes/reviews";
// import { paymentRouter } from "./routes/payments";
import { Banners } from "./modules/Banners";
import { bannersRouter } from "./routes/banners";
import { IdMaster } from "./modules/IdMaster";
import { idMasterRouter } from "./routes/idmaster";
import { Invoices } from "./modules/Invoices";
import { commonRouter } from "./routes/common";
import { Settings } from "./modules/Settings";
import { settingsRouter } from "./routes/settings";
import { bankRouter } from "./routes/bank_account";
import { cardDetailsRouter } from "./routes/card_details";
import { BankAccounts } from "./modules/BankAccount";
import { CardDetails } from "./modules/CardDetails";
import { Payments } from "./modules/Payments";
import { paymentRouter } from "./routes/payments";

require("dotenv").config();
const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
export const connectedUser: any = [];
let portEnv = process.env.DB_PORT || 5432;
let dbPort: number = +portEnv;
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: dbPort,
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities: [
    Users,
    Cuisines,
    OtpMaster,
    Roles,
    Dietries,
    DeliveryPartners,
    SpicyLevels,
    Customers,
    Chefs,
    Locations,
    Availabilities,
    Items,
    Cart,
    Orders,
    OrderItems,
    Followers,
    OrderLogs,
    Reviews,
    Banners,
    IdMaster,
    Invoices,
    Settings,
    BankAccounts,
    CardDetails,
    Payments
  ],
  synchronize: true,
});

(() => {
  app.use(setCommonHeaders());
  AppDataSource.initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  /**
   * ROUTES
   */
  app.use(userRouter);
  app.use(cuisineRouter);
  app.use(roleRouter);
  app.use(itemsRouter);
  app.use(spicyLevelRouter);
  app.use(dietriesRouter);
  app.use(customerRouter);
  app.use(deliveryPartnersRouter);
  app.use(chefsRouter);
  app.use(locationsRouter);
  app.use(availabilitiesRouter);
  app.use(cartRouter);
  app.use(orderRouter);
  app.use(followersRouter);
  app.use(orderLogsRouter);
  app.use(reviewRouter);
  app.use(paymentRouter);
  app.use(bannersRouter);
  app.use(idMasterRouter);
  app.use(commonRouter);
  app.use(settingsRouter);
  app.use(bankRouter);
  app.use(cardDetailsRouter);
  app.use((error: any, req: any, res: any, next: any) => {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.statusCode || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
  });
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    connectedUser.push({
      id: userId,
      socketId: socket.id,
    });

    socket.on("live_location", (...args) => {
      io.emit("live_to_cutomer", args);
    });
    socket.on("order_updated", (...args) => {
      console.log(args);

      io.emit("get_order", args);
    });
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
})();

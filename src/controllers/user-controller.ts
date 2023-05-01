import { AppDataSource } from "./../index";
import bcrypt from "bcrypt";
import { Users } from "../modules/User";
import jwt from "jsonwebtoken";
import { DataSource, getConnection, getRepository } from "typeorm";
import { OtpMaster } from "../modules/OtpMaster";
import { Status } from "../helpers/enums";

export const findUserByCred = async (username: string, password: string) => {
  return new Promise(async (resolve, reject) => {
    await Users.findOne({ where: { username } }).then(async (user: any) => {
      if (!user) {
        reject("Unable to login");
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        reject("Unable to login");
        return;
      }
      resolve(user);
    });
  });
};

export const generateToken = async (user: any, firebase_token: any) => {
  await Users.update({ id: user.id }, { firebase_token });
  let secret: any;
  secret = process.env.JWT_SECRET_CODE;
  const token = jwt.sign({ user_id: user.id.toString() }, secret);
  return token;
};

export const findUserByMobile = async (mobile: string) => {
  return new Promise(async (resolve, reject) => {
    await Users.findOne({ where: { mobile } }).then(async (user: any) => {
      if (!user) {
        reject("Unable to login ");
        return;
      }

      const otp: any = await generateOTP(user);

      resolve({ user, otp });
    });
  });
};

export const validateOtp = async (user_id: string, otp: string) => {
  const isValid = await AppDataSource.getRepository(OtpMaster)
    .createQueryBuilder("otp_master")
    .leftJoinAndSelect("otp_master.user", "user")
    .where("user_id = :id", { id: user_id })
    .andWhere("otp_master.status = :status", { status: "Active" })
    .andWhere("otp_master.otp_code = :otp", { otp })
    .getOne();

  if (!isValid) {
    throw Error("Invalid otp");
  }

  let user = isValid.user;

  await OtpMaster.update({ user_id: user.id }, { status: Status.EXPIRED });

  return user;
};

export const generateOTP = async (user: any) => {
  console.log(user);

  var digits = "123456789";

  var otpLength = 4;

  var otp: string = "";

  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);

    otp = otp + digits[index];
  }

  await OtpMaster.update(
    { user_id: user.id, status: Status.ACTIVE },
    { status: Status.EXPIRED }
  );

  const row = OtpMaster.create({
    user,
    mobile: user.mobile,
    otp_code: otp,
    otp_datetime: new Date(),
    otp_duration: "25",
    status: Status.ACTIVE,
  });

  await row.save();

  return otp;
};

export const updateUserType = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  const { user_type } = req.body;

  try {
    const user = await Users.findOne({ where: { id } });
    if (!user) {
      throw new Error("Can't find user");
    }
    await Users.update({ id }, { user_type });

    res.status(200).json({
      status: 0,
      message: "User has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export const getUsers = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

  const perPage = req.query.perPage || null;

  const offset = {
    skip: Number(page) * Number(perPage),
    take: Number(perPage),
  };
  let body: any = req.query;

  if (body.page || body.perPage) {
    delete body.page;
    delete body.perPage;
  }

  let relations = ["chef"];

  try {
    const chefs = await Users.find({
      where: body,
      ...offset,
      relations: relations,
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

export const getLoginTime = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: {
        time: 2.07,
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

// export const generateRefreshToken = async (user: any) => {
//   let secret : any
//   secret = process.env.JWT_REFRESH_CODE
//   const token = jwt.sign(
//     { user_id: user.id.toString() },
//     secret
//   );
//   user.tokens = user.tokens.concat(token);
//   await Users.update({ id: user.id }, { tokens: user.tokens });
//   return token;
// };

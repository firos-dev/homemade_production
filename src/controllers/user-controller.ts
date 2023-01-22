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
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        reject("Unable to login");
      }
      resolve(user);
    });
  });
};

export const generateToken = async (user: any) => {
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
    .where("otp_master.user.id = :id", { id: user_id })
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

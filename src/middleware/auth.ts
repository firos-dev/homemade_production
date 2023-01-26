import { Users } from "./../modules/User";
import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

const auth = async (req: any, res: any, next: any) => {
  let secret: any = process.env.JWT_SECRET_CODE;
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: 1,
      message: "Not authenticated",
    });
  }
  token = token.replace("Bearer ", "");
  let decoded: any = await jwt.verify(token, secret);
  let user: any = await Users.findOne({ where: { id: decoded.user_id } });
  delete user?.password;

  if (!user) {
    return res.status(401).json({
      status: 1,
      message: "Not authenticated",
    });
  }
  req.user = user;
  next();
  return;
};

export default auth;

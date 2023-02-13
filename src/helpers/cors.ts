import { NextFunction, Request, Response } from "express";

export const setCommonHeaders = () => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // const allowedOrigins = [
  //   "http://localhost:3000",
  //   "http://localhost:3001",
  //   "http://baby.axon.medipapel.com:3000",
  //   "http://mims.axon.medipapel.com:3000",
  // ]
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  response.header("Access-Control-Allow-Credentials", "true");

  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Key"
  );
  const origin = request.headers.origin as string;
    response.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  response.removeHeader("x-powered-by");
  next();
};
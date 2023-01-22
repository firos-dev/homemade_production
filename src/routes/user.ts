import { generateOTP, validateOtp } from "./../controllers/user-controller";
import express from "express";
import { Users } from "../modules/User";
const router = express.Router();
import {
  findUserByCred,
  findUserByMobile,
  generateToken,
} from "../controllers/user-controller";

router.post("/api/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      full_name,
      username,
      email,
      mobile,
      password,
      confirm_password,
    } = req.body;

    if (password && password !== confirm_password) {
      throw new Error("Password missmatch");
    }
    const user: any = Users.create({
      first_name,
      last_name,
      full_name,
      username,
      email,
      mobile,
      password,
    });

    await user.save().then(async() => {
      await findUserByMobile(mobile).then(async (data: any) => {
        let user = data.user;
        res.status(200).json({
          status: 0,
          message: "User has been successfully registered",
          data: {
            user_id: user.id,
            otp: data.otp,
            name: user.name,
            username: user.name,
            mobile: user.mobile,
            email: user.email,
          },
        });
      });
    });

  } catch (error) {
    if (error.message.includes("duplicate key")) {
      res.status(400).json({
        status: 1,
        message: "This mobile number is already registered.",
      });
      return;
    }
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    await findUserByCred(username, password)
      .then(async (user: any) => {
        let token = await generateToken(user);
        let userData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          email: user.email,
          mobile: user.mobile,
          image_url: user.image_url,
          token: token,
        };
        res.json({
          status: 0,
          data: userData,
        });
      })
      .catch((e) => {
        console.log(e);
        throw new Error(e);
      });
  } catch (error) {
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
});

router.post("/api/mobile/login", async (req, res) => {
  try {
    const { mobile } = req.body;
    await findUserByMobile(mobile).then(async (data: any) => {
      let user = data.user;
      res.status(200).json({
        status: 0,
        data: {
          user_id: user.id,
          otp: data.otp,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
});

router.post("/api/validate/otp", async (req, res) => {
  const { user_id, otp } = req.body;

  try {
    await validateOtp(user_id, otp).then(async (user) => {
      let token = await generateToken(user);
      res.status(200).json({
        status: 1,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          full_name: user.full_name,
          email: user.email,
          mobile: user.mobile,
          image_url: user.image_url,
        },
        token: token,
      });
    });
  } catch (e) {
    res.status(400).json({
      status: 1,
      user: e.message,
    });
  }
});

router.post("/api/resend/otp", async (req, res) => {
  let { user_id } = req.body;
  try {
    const user: any = await Users.findOne({ where: { id: user_id } });
    if (!user) {
      res.status(400).json({
        status: 1,
        message: "Unable to login",
      });
    }
    await generateOTP(user).then((data: any) => {
      res.status(200).json({
        status: 0,
        data: {
          user_id: user.id,
          otp: data,
        },
      });
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
});

// router.post(validate)

export { router as userRouter };

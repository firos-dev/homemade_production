import {
  generateOTP,
  getUsers,
  validateOtp,
  getLoginTime,
} from "./../controllers/user-controller";
import express from "express";
import { Users } from "../modules/User";
const router = express.Router();
import {
  findUserByCred,
  findUserByMobile,
  generateToken,
  updateUserType,
} from "../controllers/user-controller";
import auth from "../middleware/auth";

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
    let registeredUser: any;
    let error: any;
    await findUserByMobile(mobile)
      .then((result) => {
        registeredUser = result;
      })
      .catch((err) => {
        error = err;
      });

    if (!error) {
      return res.status(200).json({
        status: 0,
        message: "Mobile number already registered,",
        data: {
          user_id: registeredUser.user.id,
          otp: registeredUser.otp,
          first_name: registeredUser.user.first_name,
          middle_name: registeredUser.user.middle_name,
          last_name: registeredUser.user.last_name,
          full_name: registeredUser.user.full_name,
          username: registeredUser.username,
          mobile: registeredUser.user.mobile,
          email: registeredUser.user.email,
        },
      });
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

    return await user.save().then(async () => {
      await findUserByMobile(mobile).then(async (data: any) => {
        let user = data.user;
        return res.status(200).json({
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
    console.log(error);
    return res.status(400).json({
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
        let token = await generateToken(user, null);
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
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
});

router.post("/api/mobile/login", async (req, res) => {
  try {
    const { mobile } = req.body;
    await findUserByMobile(mobile)
      .then(async (data: any) => {
        let user = data.user;
        res.status(200).json({
          status: 0,
          data: {
            user_id: user.id,
            otp: data.otp,
          },
        });
      })
      .catch((e) => {
        throw new Error(e);
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
  const { user_id, otp, firebase_token } = req.body;

  try {
    await validateOtp(user_id, otp).then(async (user) => {
      let token = await generateToken(user, firebase_token);
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
          user_type: user.user_type,
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

router.patch("/api/user/type/:id", auth, updateUserType);
router.get("/api/users", auth, getUsers);
router.get("/api/logintime", auth, getLoginTime);

export { router as userRouter };

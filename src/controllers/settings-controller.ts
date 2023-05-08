import { Settings } from "../modules/Settings";

const createSettings = async (req: any, res: any, next: any) => {
  const { name, value } = req.body;
  try {
    const settings = Settings.create({
      name,
      value
    });
    await settings.save().then(() => {
      res.status(201).json({
        status: 0,
        message: `settings has been successfully created`,
      });
    });
  } catch (error) {
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};


export default {createSettings}
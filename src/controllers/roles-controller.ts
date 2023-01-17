import { Roles } from "./../modules/Roles";
const createRole = async (req: any, res: any, next: any) => {
  const { name } = req.body;
  try {
    const role = Roles.create({
      name,
    });
    await role.save().then(() => {
      res.status(201).json({
        status: 0,
        message: `Role ${name} has been successfully created`,
      });
    });
  } catch (error) {
    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};


export default {createRole}
import { IdMaster } from "../modules/IdMaster";

const createIdmaster = async (req: any, res: any) => {
    console.log(req.body);
    
  const {
    name,
    field_name,
    table,
    prefix,
    suffix,
    start_value,
    end_value,
    current_value,
    next_value
  } = req.body;

  try {
    let idmaster = IdMaster.create({
      name,
      field_name,
      table,
      prefix,
      suffix,
      start_value,
      end_value,
      current_value,
      next_value,
    });

    await idmaster.save();

    res.status(201).json({
      success: 0,
      message: "record has been added in id master",
      data: idmaster,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      success: 1,
      message: e.message,
    });
  }
};
export default { createIdmaster };

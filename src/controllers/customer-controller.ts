import { Customers } from "./../modules/Customers";
const createCustomer = async (req: any, res: any, next: any) => {
  try {
    const customers = Customers.create(req.body);
    await customers.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: customers,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCustomers = async (req: any, res: any, next: any) => {
  try {
    const customers = await Customers.find();
    res.status(200).json({
      status: 0,
      data: customers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { createCustomer, getCustomers };

import { Customers } from "./../modules/Customers";
const createCustomer = async (req: any, res: any, next: any) => {
  try {
    const customer = Customers.create(req.body);
    await customer.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCustomers = async (req: any, res: any, next: any) => {
  const page = req.query.page || null;

    const perPage = req.query.perPage || null;

    const offset = {
      skip: Number(page) * Number(perPage),
      take: Number(perPage),
    };

    let body = req.query;

    if (body.page || body.perPage) {
      delete body.page;
      delete body.perPage;
    }
  try {
    const customers = await Customers.find({
      where: body,
      ...offset,
      relations: ["user"],
      order: {created_at: "DESC"}
    });
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

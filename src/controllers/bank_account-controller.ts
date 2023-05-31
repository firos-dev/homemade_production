import { BankAccounts } from "../modules/BankAccount";

const addBankAccount = async (req: any, res: any, next: any) => {
  try {
    if (!req.body.user_id) {
      throw new Error("User id is missing");
    }
    const account = BankAccounts.create(req.body);
    await account.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: account.id,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getAccounts = async (req: any, res: any, next: any) => {
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
    const accounts = await BankAccounts.find({
      where: body,
      ...offset,
      relations: ["user"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: accounts,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const updateAccount = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await BankAccounts.update({ id }, req.body);
    res.status(200).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default { addBankAccount, getAccounts, updateAccount };

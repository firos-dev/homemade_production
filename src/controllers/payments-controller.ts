import { AppDataSource } from "./../index";

const addBankAccount = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      message: "Record has been successfully saved",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const getBankAccount = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: [
        {
          account_holder_name: "John Doe",
          bank_name: "Federal Bank",
          account_number: "*********872364",
          ifsc_code: "21554",
        },
      ],
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};
const addPaymentMethod = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      message: "Record has been successfully saved",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};
const getPaymentMethod = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: [
        {
          payment_method: "Card",
          name: "John doe",
          card_number: "8769876",
          expiry_date: "11/25",
        },
      ],
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};
const getEarnings = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: {
        amount: 750,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

export default {
  getEarnings,
  addBankAccount,
  addPaymentMethod,
  getBankAccount,
  getPaymentMethod
};

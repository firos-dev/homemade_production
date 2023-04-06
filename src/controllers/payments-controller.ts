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
        message: error.messages,
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
        message: error.messages,
      });
    }
  };
  
  export default {getEarnings, addBankAccount}
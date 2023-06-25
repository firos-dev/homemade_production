import { AppDataSource } from "../";
import { Wallet } from "../modules/Wallet";

const getWalletOfUser = async (req: any, res: any, next: any) => {
  let { user_id } = req.params;
  try {

    const wallets = await AppDataSource.getRepository(Wallet)
    .createQueryBuilder("wallet")
    .leftJoinAndSelect("wallet.user", "user")
    .where("wallet.user_id = :id", { id: user_id })
    .andWhere("wallet.withdraw = :withdraw", { withdraw: false })
    .getMany();

    res.status(200).json({
      status: 0,
      data: wallets,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const updateWallet = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error("Please provide id as params");
    }
    if (!Object.keys(req.body).length) {
      throw new Error("No updates found");
    }
    await Wallet.update({ id }, req.body);
    res.status(201).json({
      status: 0,
      message: "Record has been successfully updated",
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

export default {
  getWalletOfUser,
  updateWallet
};

import { CardDetails } from "../modules/CardDetails";

const addCard = async (req: any, res: any, next: any) => {
  try {
    if (!req.body.user_id) {
      throw new Error("User id is missing");
    }
    const card = CardDetails.create(req.body);
    await card.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getCards = async (req: any, res: any, next: any) => {
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
    const cards = await CardDetails.find({
      where: body,
      ...offset,
      relations: ["user"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: cards,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};

const updateCard = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await CardDetails.update({ id }, req.body);
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

const deleteCard = async (req: any, res: any, next: any) => {
  const { id } = req.params;

  try {
    await CardDetails.delete({ id });
    res.status(200).json({
      status: 0,
      message: "Record has been successfully deleted",
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
  addCard,
  getCards,
  updateCard,
  deleteCard
};

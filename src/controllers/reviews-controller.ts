import { Orders } from "./../modules/Orders";
import { Reviews } from "./../modules/Reviews";

const addReview = async (req: any, res: any, next: any) => {
  const {
    order_id,
    reviewed_id,
    chef_id,
    delivery_partner_id,
    item_id,
    item_review,
    chef_review,
    delivery_review,
    star_count,
  } = req.body;
  try {
    if (!reviewed_id) {
      throw new Error("Please provide reviewed by user");
    }
    if (order_id) {
      await Orders.update({ id: order_id }, { reviewed: true });
    }
    let review = Reviews.create({
      reviewed_id,
      chef_id,
      delivery_partner_id,
      item_id,
      item_review,
      chef_review,
      delivery_review,
      star_count,
    });

    await review.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: review,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getReviews = async (req: any, res: any, next: any) => {
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
    const data = await Reviews.find({
      where: body,
      ...offset,
      relations: ["reviewed_by", "item", "chef", "delivery_partner"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: data,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};
const getAvrageRating = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: {
        rating: 4.5,
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

export default { addReview, getReviews, getAvrageRating };

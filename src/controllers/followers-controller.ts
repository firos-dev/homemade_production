import { Followers } from "./../modules/Followers";

const followUser = async (req: any, res: any, next: any) => {
  const { follow_id, followed_by_id } = req.body;
  try {
    if (!follow_id) {
      throw new Error("Please provide follow ID");
    }
    if (!followed_by_id) {
      throw new Error("Please provide followed by ID");
    }
    let follow = Followers.create({
      follow_id,
      followed_by_id,
    });
    await follow.save();
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: location,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const getFollowers = async (req: any, res: any, next: any) => {
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
    const followers = await Followers.find({
      where: body,
      ...offset,
      relations: ["follow", "followed_by"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: followers,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

const unfollowUser = async (req: any, res: any, next: any) => {
  const { id } = req.params;
  try {
    await Followers.delete({ id });
    res.status(200).json({
      status: 0,
      message: "Record has been successfully deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.messages,
    });
  }
};

export default { followUser, getFollowers, unfollowUser };

import { OrderLogs } from "./../modules/OrderLogs";
const createOrderLog = async (req: any, res: any, next: any) => {
  const { order_id, activity, datetime } = req.body;
  console.log(datetime);
  
  try {
    if (!order_id) {
      throw new Error("Please provide order ID");
    }
    const logs = OrderLogs.create({
      order_id,
      activity,
      datetime,
    });
    await OrderLogs.save(logs);
    res.status(201).json({
      status: 0,
      message: "Record has been successfully saved",
      data: logs,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

export default { createOrderLog };

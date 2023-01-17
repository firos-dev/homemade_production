import { DeliveryPartners } from "../modules/DeliveryPartners";

const createDeliveryPartner = async (req: any, res: any, next: any) => {
    try {
      const deliveryPartner = DeliveryPartners.create(req.body);
      await deliveryPartner.save();
      res.status(201).json({
        status: 0,
        message: "Record has been successfully saved",
        data: deliveryPartner,
      });
    } catch (error) {
      res.status(400).json({
        status: 0,
        message: error.message,
      });
    }
  };

  const getDeliveryPartners= async (req: any, res: any, next: any) => {
    try {
      const deliverPartners = await DeliveryPartners.find();
      res.status(200).json({
        status: 0,
        data: deliverPartners,
      });
    } catch (error) {
      console.log(error);
  
      res.status(400).json({
        status: 1,
        message: error.messages,
      });
    }
  };

  export default {createDeliveryPartner, getDeliveryPartners}


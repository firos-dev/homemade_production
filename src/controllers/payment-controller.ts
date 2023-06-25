import { DeliveryPartners } from "./../modules/DeliveryPartners";
import { Payments } from "../modules/Payments";
import paymentMethods from "../helpers/paymentMethods";
import { Invoices } from "../modules/Invoices";
import axios from "axios";
import { AmountType, Wallet } from "../modules/Wallet";

const createPayment = async (req: any, res: any, next: any) => {
  let { invoice_id, method_id, currency }: any = req.body;
  try {
    let token: string = process.env.MYFATOORAH_TOKEN || ""; //token value to be placed here;
    let baseURL = "https://apitest.myfatoorah.com";
    let invoice: any = await Invoices.findOne({
      where: { id: invoice_id },
      relations: ["order", "order.chef", "order.delivery_partner"],
    });

    return initiatePayment(baseURL, token, invoice)
      .then((result) => {
        return executePayment(baseURL, token, method_id);
      })
      .then(async () => {
        let pm = paymentMethods.find((pm) => pm.id === method_id);
        const payment = Payments.create({
          invoice_id,
          amount: invoice.grand_total,
          payment_method: pm?.method,
          payment_method_ar: pm?.method_ar,
          payment_method_id: pm?.id,
          currency,
        });
        await payment.save();

        let commission: any;
        let delivery_charge: any;
        const dp = invoice?.order?.delivery_partner;
        const chef = invoice?.order?.chef;
        if (invoice.delivery_charge_excluded === false) {
          let chargePerKm = dp?.delivery_charge;
          delivery_charge = invoice.order.distance * chargePerKm;
        }

        let commissionPercent = chef?.commission;
        commission = (commissionPercent / 100) * invoice.grand_total;
        if (commission) {
          let cms = Wallet.create({
            payment_id: payment.id,
            user_id: chef.id,
            amount: commission,
            amount_type: AmountType.COMMISSION,
          });
          await cms.save();
        }
        if (delivery_charge) {
          let dc = Wallet.create({
            payment_id: payment.id,
            user_id: dp.id,
            amount: delivery_charge,
            amount_type: AmountType.DELIVERY_CHARGE,
          });
          await dc.save();
        }
      })
      .catch((e) => {});
  } catch (error) {}
};

const initiatePayment = (baseURL: string, token: string, invoice: any) => {
  return new Promise(async (resolve, reject) => {
    console.log(
      "#################### InitiatePayment ########################"
    );

    const options: any = {
      method: "POST",
      url: baseURL + "/v2/InitiatePayment",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: {
        InvoiceAmount: invoice.grand_total,
        CurrencyIso: invoice.currency,
      },
      json: true,
    };
    await axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const listPayments = () => {
  
};

const executePayment = (baseURL: string, token: string, method_id: string) => {
  return new Promise(async (resolve, reject) => {
    console.log("#################### ExecutePayment ########################");

    const options: any = {
      method: "POST",
      url: baseURL + "/v2/ExecutePayment",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: {
        PaymentMethodId: method_id,
        InvoiceValue: 100,
      },
      json: true,
    };

    await axios(options)
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

const getPaymentMethods = async (req: any, res: any, next: any) => {
  try {
    res.status(200).json({
      status: 0,
      data: paymentMethods,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: 1,
      message: error.message,
    });
  }
};


const getPayments = async (req: any, res: any, next: any) => {
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
    const payments = await Payments.find({
      where: body,
      ...offset,
      relations:["user"],
      order: { created_at: "DESC" },
    });
    res.status(200).json({
      status: 0,
      data: payments,
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
  createPayment,
  getPaymentMethods,
  getPayments
};

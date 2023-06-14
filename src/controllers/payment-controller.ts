import { Payments } from "../modules/Payments";
import paymentMethods from "../helpers/paymentMethods";
import { Invoices } from "../modules/Invoices";
import axios from "axios";

const createPayment = async (req: any, res: any, next: any) => {
  let { invoice_id, method_id, currency }: any = req.body;
  try {
    let token: string = process.env.MYFATOORAH_TOKEN || ""; //token value to be placed here;
    let baseURL = "https://apitest.myfatoorah.com";
    let invoice: any = await Invoices.findOne({ where: { id: invoice_id } });

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
        await payment.save()
      })
      .catch((e) => {

      });
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

export default {
  createPayment,
  getPaymentMethods,
};

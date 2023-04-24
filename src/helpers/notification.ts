import axios from "axios";

export const sendNotification = async ({ user, title, body, data }: any) => {
  await axios
    .post(
      "https://fcm.googleapis.com/fcm/send",
      {
        to: user.firebase_token,
        // "to": "AAAA-9ZvKuw:APA91bH1RJCtQ2jGJzbhmnQgPpy2wqxFfSt8ragMcDGy4AyKWK6VW7nziyVH9_2AylstpW7R8nYHbab2PAG6ci2fq3nVpqVi1PAbk9oAykanstKMnLbnRrDIkvMOxuz3R1ZJSFyQCIWi",
        notification: {
          title: title,
          body: body,
        },
        data: data,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `key=${process.env.FIREBASE_KEY}`,
        },
      }
    )
    .then((suc) => {
      console.log("FIREBASE PUSH SUCCSESS: ");
    })
    .catch((e) => {
      console.log("FIREBASE PUSH ERROR: ", e);
    });
};

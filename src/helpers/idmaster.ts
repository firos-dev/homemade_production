import { IdMaster } from "../modules/IdMaster";

const getIdmaster = (name: any) => {
  return new Promise((resolve, reject) => {
    IdMaster.findOne({ where: { name } })
      .then((response: any) => {
        resolve(response);
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

const updateIdmaster = (idmaster: any) => {
  return new Promise((resolve, reject) => {
    let body = {
      current_value: idmaster.next_value,
      next_value: idmaster.next_value + 1,
    };
    IdMaster.update({ id: idmaster.id }, body)
      .then(() => {
        resolve("success");
      })
      .catch((e) => {
        reject(e.message);
      });
  });
};

export default { getIdmaster, updateIdmaster };

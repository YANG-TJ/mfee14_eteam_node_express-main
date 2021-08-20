const db = require("./mysql2-connect");

const moment = require("moment-timezone");

class UsersDiscount {
  constructor(data) {
    let defaultData = {
      dId: null,
      uAcco: "",
      dName: 0,
      dPrice: "",
      created_at: "1970-01-01",
      expiry: "1970-01-01",
    };
    this.data = { ...defaultData, ...data };
  }
  // 尚未使用
  async CanUseDiscount(uId) {
    if (uId) {
      const sqlvalidDisc = "SELECT `validDisc` FROM `users` WHERE `uId`= ?";
      const [resultValidDisc] = await db.query(sqlvalidDisc, [uId]);
      const resultValidDiscUId = resultValidDisc[0].validDisc.split(",");
      // console.log(resultValidDiscUUId);

      const sqlDiscount =
        "SELECT`dName`,`dPrice`,`created_at`FROM `discount`WHERE `dId`IN(?)";
      const [result] = await db.query(sqlDiscount, [
        resultValidDiscUId.slice(0),
      ]);

      //  時間顯示 = moment(設定時間).format(時間格式)
      //   return moment(result[0].created_at).format('YYYY-MM-DD')
      for (let i = 0; i < result.length; i++) {
        result[i].created_at = moment(result[i].created_at).format(
          "YYYY-MM-DD"
        );
      }
      // console.log(Number(result[0].created_at.split("-")[0])+2 +"-"+result[0].created_at.split("-")[1]+"-"+(Number(result[0].created_at.split("-")[2])-1)); //加2年減1天

      for (let i = 0; i < result.length; i++) {
        result[i].expiry = moment(
          Number(result[i].created_at.split("-")[0]) +
            2 +
            "-" +
            result[i].created_at.split("-")[1] +
            "-" +
            (Number(result[i].created_at.split("-")[2]) - 1)
        ).format("YYYY-MM-DD");
      }
      return result;
    } else {
      return false;
    }
  }

  // 已使用
  async NotCanUseDiscount(uId) {
    if (uId) {
      const sqlinvalidDisc = "SELECT `invalidDisc` FROM `users` WHERE `uId`= ?";
      const [resultinValidDisc] = await db.query(sqlinvalidDisc, [uId]);
      const resultinValidDiscUId = resultinValidDisc[0].invalidDisc.split(",");
      // console.log(resultValidDiscUUId);

      const sqlDiscount =
        "SELECT`dName`,`dPrice`,`created_at`FROM `discount`WHERE `dId`IN(?)";
      const [result] = await db.query(sqlDiscount, [
        resultinValidDiscUId.slice(0),
      ]);

      //  時間顯示 = moment(設定時間).format(時間格式)
      //   return moment(result[0].created_at).format('YYYY-MM-DD')
      for (let i = 0; i < result.length; i++) {
        result[i].created_at = moment(result[i].created_at).format(
          "YYYY-MM-DD"
        );
      }
      return result;
    } else {
      return false;
    }
  }
}

module.exports = UsersDiscount;

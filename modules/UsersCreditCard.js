const db = require("./mysql2-connect");

const moment = require("moment-timezone");

class UsersCreditCard {
  constructor(data) {
    let defaultData = {
      cId: null,
      cName: "",
      cNum: "",
      cExp: "",
      cCCV: 0,
      uId: 0,
    };
    this.data = { ...defaultData, ...data };
  }

  async readUsersCreditCard(uId) {
    if (uId) {
      const sql = "SELECT * FROM `credit_card` WHERE `uId` = ?";
      const [result] = await db.query(sql, [uId]);
      //   //  時間顯示 = moment(設定時間).format(時間格式)
      //   for (let i = 0; i < result.length; i++) {
      //     result[i].cExp = moment(result[i].cExp).format("MM-YY");
      return result;
      //   }
    } else {
      return false;
    }
  }

  async deleteUsersCreditCard(uId, cId) {
    if (uId && cId) {
      const sql = "DELETE FROM `credit_card`WHERE `uId` = ? AND `cId` = ?";
      const [result] = await db.query(sql, [uId, cId]);
      return result;
    } else {
      return false;
    }
  }

  async addUsersCreditCard() {
    if (!this.data.cId) {
      const sql = "INSERT INTO `credit_card` SET ?";
      const [result] = await db.query(sql, [this.data]);
      if (result.insertId) {
        this.data.cId = result.insertId;
        return this.data;
      } else {
        return false; //新增失敗
      }
    }
  }

  async readSingleUsersCreditCard(uId, cId) {
    if (uId && cId) {
      const sql = "SELECT * FROM `credit_card` WHERE `uId` = ? AND `cId`= ?";
      const [result] = await db.query(sql, [uId, cId]);

      // result[0].cExp = moment(result[0].cExp).format("MM-YY");

      return result[0];
    } else {
      return false;
    }
  }

  async editUsersCreditCard(cId) {
    if (this.data.cId) {
      delete this.data.uId;

      // 判斷 若為空值，則不更改(刪除)
      if (this.data.cName === "") delete this.data.cName;
      if (this.data.cNum === "") delete this.data.cNum;
      if (this.data.cExp === "") delete this.data.cExp;
      if (this.data.cCCV === "") delete this.data.cCCV;
      const sql = "UPDATE `credit_card` SET ? WHERE `cId` = ?";
      const [result] = await db.query(sql, [this.data, cId]);
      return this.data;
    } else {
      return false;
    }
  }
}

module.exports = UsersCreditCard;

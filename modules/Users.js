// users專門寫sql 及判斷式用

const db = require("./mysql2-connect");

const moment = require("moment-timezone");

// 用類別宣告 初始化
class Users {
  constructor(data) {
    // 用物件當初始值 (一定要跟資料表欄位相符  少一個都不行)
    let defaultData = {
      // 資料表欄位名稱: 類型
      uId: null,
      uAcco: "",
      uPwd: "",
      uName: "",
      uTWId: "",
      uBirth: "1970-01-01",
      uGender: "",
      uImg: "",
      uMail: "",
      uPhone: "",
      uCountry: "",
      uCity: "",
      uTownship: "",
      uStreet: "",
      uDiscr: "",
      uNickname: "",
      uHobby: "",
    };
    // ...data 新接受的值  蓋過  ...defaultData初始值
    this.data = { ...defaultData, ...data };
  }

  // CRUD

  // 新增 usersRegister
  async addUserSQL() {
    // uPwd 加密功能
    // 直接執行方法
    // const hash = bcrypt.hashSync(`${this.data.uPwd}`, 10);
    // this.data.uPwd = hash;

    // 異部執行方法(在這不適用)
    //  bcrypt.hash(`${this.data.uPwd}`, 10, (err, hash) => {
    //   this.data.uPwd = hash;
    //   });

    // 判斷 uId 是否為 null, 表示是新建的物件
    if (!this.data.uId) {
      //    判斷帳號 是否重複
      const uAccosql = "SELECT `uAcco` FROM `users` WHERE uAcco = ? ";
      const [resultUaccoSame] = await db.query(uAccosql, [this.data.uAcco]);
      if (resultUaccoSame.length) return false; // 帳號重複

      // INSERT INTO `users` SET "key" = "value"
      const sql = "INSERT INTO `users` SET ?";
      const [result] = await db.query(sql, [this.data]);
      if (result.insertId) {
        this.data.uId = result.insertId;
        return this.data;
      } else {
        return false; //新增失敗
      }
    }
  }

  // 讀取單筆 與  編輯-1 (顯示原資料)
  // static(靜態)，在使用時不用呼叫實體(new) 即可被使用
  static async readUserSQL(uId) {
    if (uId) {
      const sql = "SELECT * FROM `users` WHERE `uId`= ? ";
      const [result] = await db.query(sql, [uId]);
      // return moment(result[0].uBirth).format('YYYY-MM-DD');
      //  時間顯示 = moment(設定時間).format(時間格式)
      result[0].uBirth = moment(result[0].uBirth).format("YYYY-MM-DD");
      return result[0];
    } else {
      return false; //讀取失敗
    }
  }

  // 編輯-2 (更新資料)
  async updateUserByIdSQL(uId) {
    if (this.data.uId) {
      // 先刪除不能修改的部分
      delete this.data.uAcco;
      // 判斷 若為空值，則不更改(刪除)

      if (this.data.uName === "") delete this.data.uName;
      if (this.data.uPwd === "") delete this.data.uPwd;
      if (this.data.uTWId === "") delete this.data.uTWId;
      if (this.data.uMail === "") delete this.data.uMail;
      if (this.data.uPhone === "") delete this.data.uPhone;
      if (this.data.uBirth === "") delete this.data.uBirth;
      if (this.data.uCountry === "") delete this.data.uCountry;
      if (this.data.uCity === "") delete this.data.uCity;
      if (this.data.uTownship === "") delete this.data.uTownship;
      if (this.data.uStreet === "") delete this.data.uStreet;
      if (this.data.uDiscr === "") delete this.data.uDiscr;
      if (this.data.uGender === "") delete this.data.uGender;
      if (this.data.uImg === "") delete this.data.uImg;
      if (this.data.uNickname === "") delete this.data.uNickname;
      if (this.data.uHobby === "") delete this.data.uHobby;

      const sql = "UPDATE `users` SET ? WHERE `uId`= ?";
      const [result] = await db.query(sql, [this.data, uId]);
      return this.data;
    } else {
      return false; //編輯失敗
    }
  }

  // 上傳檔案後，將檔名放入database
  async usersEditImgUpload(uImg, uId) {
    if (uImg) {
      const sql = "UPDATE `users` SET `uImg`= ? WHERE `uId`= ?";
      const [result] = await db.query(sql, [uImg, uId]);
      return result;
    } else {
      return false;
    }
  }
}
module.exports = Users;

//無法sql injection
// let sql = `INSERT INTO users(uAcco,uPwd, uMail,uPhone,uName,uTWId,uBirth,uCountry,uCity,uTownship,uStreet) VALUES('${req.body.uAcco}', '${req.body.uPwd}', '${req.body.uMail}', '${req.body.uPhone}', '${req.body.uName}','${req.body.uTWId}','${req.body.uBirth}','${req.body.uCountry}','${req.body.uCity}','${req.body.uTownship}','${req.body.uStreet}')`;
// 測試用  不傳資料庫
// console.log(sql);
// return res.json({sql,body:req.body});
// let [result] = await db.query(sql);

// 無法使用
// let sql = `INSERT INTO users(uAcco,uPwd, uMail,uPhone,uName,uTWId,uBirth,uCountry,uCity,uTownship,uStreet) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;

// let users = new Users(
//   req.body.uAcco,
//   req.body.uPwd,
//   req.body.uMail,
//   req.body.uPhone,
//   req.body.uName,
//   req.body.uTWId,
//   req.body.uBirth,
//   req.body.uCountry,
//   req.body.uCity,
//   req.body.uTownship,
//   req.body.uStreet
// );

// executeSQL(users.addUserSQL(), res, "post", false, users);

//   const data = {
//     ...req.body
// }
//   const sql = "INSERT INTO `users` SET ?";
//   const [result] = await db.query(sql, [data]);

//   if (result.affectedRows === 1) {
//     output.success = true;
//     output.insertId = result.insertId;
//   } else {
//     output.error = "資料新增失敗";
//   }

//   output = { ...output, body: [req.body] ,result};

const db = require("./mysql2-connect");

const moment = require("moment-timezone");

class Message {
  constructor(data) {
    // 僅初始化要新增/修改用的欄位
    let defaultData = {
      mId: null,
      iId: 0,
      uId: 0,
      message: "",
      mStar: 0,
      mLike: 0,
      created_at: "",
    };
    this.data = { ...defaultData, ...data };
  }

  async readMessageText(iId) {
    if (iId) {
      const sql =
        "SELECT `mId`,`uImg`,`uName`,`message`,`mStar`,`mLike`,`msgboard`.`created_at`FROM `msgboard`JOIN `users`ON `msgboard`.`uId` = `users`.`uId`WHERE `msgboard`.`iId` = ?";
      const [result] = await db.query(sql, [iId]);
      //  時間顯示 = moment(設定時間).format(時間格式)
      // return result[1].oDate = moment(result[1].oDate).format(
      //   "YYYY-MM-DD"
      // )
      for (let i = 0; i < result.length; i++) {
        result[i].created_at = moment(result[i].created_at).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      return result;
    } else {
      return false;
    }
  }

  async addMessageText() {
    if (!this.data.mId) {
      if (this.data.created_at === "") delete this.data.created_at;
      const sql = "INSERT INTO `msgboard` SET ?";
      const [result] = await db.query(sql, [this.data]);
      if (result.insertId) {
        this.data.mId = result.insertId;
        return this.data;
      } else {
        return false;
      }
    }
  }

  async usersImgMessage(uId) {
    if (uId) {
      const sql = "SELECT `uImg`,`uName` FROM `users` WHERE `uId`=?";
      const [result] = await db.query(sql, [uId]);
      return result;
    } else {
      return false;
    }
  }

  async usersMlikeMessage(uId, mId) {
    if (uId && mId) {
      // 先取出原本的值
      const sqlSelectUsers = "SELECT `uLike` FROM `users` WHERE `uId`=?";
      const [resultSelectUsers] = await db.query(sqlSelectUsers, [uId]);
      // console.log(resultSelectUsers[0].uLike);//1,2,3 字串

      // 一開始的陣列
      const newResultSelectUsers = resultSelectUsers[0].uLike.split(",");

      // console.log(newResultSelectUsers);
      // filter 要注意資料型態的比較  及  是否要加return
      const remove = newResultSelectUsers.filter((v) => {
        return v !== mId;
      });
      // 確認是否如期去除，以保證無重複的mId
      // filter 後的陣列
      // console.log(remove);

      const removeFinally = remove.map((v)=>{return v}).join(",")
      // console.log(removeFinally);

      if (remove.length < newResultSelectUsers.length) {
        const sqlRemove ="UPDATE `users` SET `uLike` = ? WHERE `uId` = ?"
        const [resultRemove] = await db.query(sqlRemove,[removeFinally,uId])

        // 確認目前讚總數
        const sqlSelectMessage = "SELECT `mLike` FROM `msgboard` WHERE `mId`= ?"
        const [resultSelectMessage] = await db.query(sqlSelectMessage,[mId]) 

        // 點讚數-1
        const mLikeFinallyTotalCountD= Number(resultSelectMessage[0].mLike)-1;
        console.log(mLikeFinallyTotalCountD);
        // 將更新後的讚總數存回去
        const sqlUpdateMessageD ="UPDATE `msgboard` SET `mLike`=? WHERE `mId`=?"
        const [resultUpdateMessageD] = await db.query(sqlUpdateMessageD,[mLikeFinallyTotalCountD,mId])
      
         // 讀取最後資料 -1
         const sqlSelectMessageD = "SELECT `mLike` FROM `msgboard` WHERE `mId`= ?"
         const [resultSelectMessageD] = await db.query(sqlSelectMessageD,[mId]) 
         return 0

      } else {
        const removeCount = remove.push(mId);
        // console.log(removeCount); // 4 陣列長度
        // console.log(remove); // [1,2,3,29] 實際陣列

        const finallyRomove = remove
          .map((v) => {
            return v;
          })
          .join(",");
        //  console.log(finallyRomove);

        // console.log((newResultSelectUsers +"," + "4").split(",")); //字串相加後再轉為array ["1","2","3","4"]

        // 將整理好的值，更新至欄位
        const sqlUpdateUsers = "UPDATE `users` SET `uLike` = ? WHERE `uId` = ?";
        const [resultUpdateUsers] = await db.query(sqlUpdateUsers, [
          finallyRomove,
          uId,
        ]);
        // 確認目前讚總數
        const sqlSelectMessage = "SELECT `mLike` FROM `msgboard` WHERE `mId`= ?"
        const [resultSelectMessage] = await db.query(sqlSelectMessage,[mId]) 
        // console.log(resultSelectMessage[0].mLike);
        // 點讚數+1
        const mLikeFinallyTotalCountP= Number(resultSelectMessage[0].mLike)+1;
        console.log(mLikeFinallyTotalCountP);
        // 將更新後的讚總數存回去
        const sqlUpdateMessageP ="UPDATE `msgboard` SET `mLike`=? WHERE `mId`=?"
        const [resultUpdateMessageP] = await db.query(sqlUpdateMessageP,[mLikeFinallyTotalCountP,mId])
        // 讀取最後資料 +1
        const sqlSelectMessageP = "SELECT `mLike` FROM `msgboard` WHERE `mId`= ?"
        const [resultSelectMessageP] = await db.query(sqlSelectMessageP,[mId]) 
        return 1

      }

      // 在users取出所有uLike內的mId，並將相同mId相加計算總和

      // const sqlSelectUlikeToMid = "SELECT `uLike` FROM `users`"
      // const [resultSelectUlikeToMid] = await db.query(sqlSelectUlikeToMid)
      // const countMid  = resultSelectUlikeToMid.map((v)=>{return v.uLike}).join(",")

      // console.log(countMid);

      // 存至mLike
      // const sqlUpdateMessage = "UPDATE `msgboard` SET `mLike` = ? WHERE `mId` = ?"
    } else {
      return false;
    }
  }
}

module.exports = Message;

const db = require("./mysql2-connect");

class UsersTrack {
  constructor(data) {
    let defaultData = {
      uAcco: null,
      iImg: "",
      iName: "",
      sName: "",
      iPrice: 0,
      iId: 0,
    };
    this.data = { ...defaultData, ...data };
  }

  async readUsersTrack(uId) {
    if (uId) {
      const sqlFollowList = "SELECT `followList` FROM `users` WHERE `uId`= ?";
      const [resultFollowList] = await db.query(sqlFollowList, [uId]);
      const resultFollowListIid = resultFollowList[0].followList.split(","); // 將string 轉成array

      // resultFollowList.slice(1,-1).split(',');
      // 1,2,3,4,5,6 = resultFollowListIid
      // console.log(resultFollowListIid);
      // return resultFollowListIid;
      // ? 內若被當成一個字串，則只會顯示一筆資料 ('1,2,3,4,5,6')
      const sqlItem =
        "SELECT`items`.`iId`,`iImg`,`iName`,`sName`,`iPrice`FROM `items`JOIN `specification`ON `items`.`iId` = `specification`.`iId`WHERE `items`.`iId`IN(?)";
      // const sqlItem =
      //   "SELECT `iImg`,`iName`,`sName`,`iPrice`FROM `items`JOIN `specification`ON `items`.`iId` = `specification`.`iId`WHERE `items`.`iId`= ?";
      const [result] = await db.query(sqlItem, [resultFollowListIid.slice(0)]); // 為了去除''
      // console.log(result);
      return result;
    } else {
      return false;
    }
  }

  async deleteUsersTrack(uId, iId) {
    if (uId && iId) {
      const sqlFollowList = "SELECT `followList` FROM `users` WHERE `uId`= ?";
      const [resultFollowList] = await db.query(sqlFollowList, [uId]);
      // console.log("resultFollowList:",resultFollowList);//[1,2,3,4,5,6]
      const resultFollowListIid = resultFollowList[0].followList.split(","); // 將string 轉成array

      console.log(resultFollowListIid); //["1","2","3"]
      // console.log(resultFollowListIid[1]); //2
      // 去除含有iId 的array 保留剩下的組成array
      // filter 要注意資料型態的比較  及  是否要加return
      const remove = resultFollowListIid.filter((v) => {
        return Number(v) !== iId;
      });
      console.log(remove); //["2","3"]
      // 將array 拆解成string 存入資料庫
      const removeFinally = remove
        .map((v) => {
          return v;
        })
        .join(","); //  '2','3'

      console.log(removeFinally);

      const sql = "UPDATE `users` SET `followList` = ? WHERE `uId` = ?";
      const [result] = await db.query(sql, [removeFinally, uId]);
      return result;
    } else {
      return false;
    }
  }
  // 分頁
  async pageUsersTrack(uId,firstNum,pageNum){

    const sqlFollowList = "SELECT `followList` FROM `users` WHERE `uId`= ?";
    const [resultFollowList] = await db.query(sqlFollowList, [uId]);
    const resultFollowListIid = resultFollowList[0].followList.split(","); // 將string 轉成array


    const sql = "SELECT`items`.`iId`,`iImg`,`iName`,`sName`,`iPrice`FROM `items`JOIN `specification`ON `items`.`iId` = `specification`.`iId`WHERE `items`.`iId`IN(?) LIMIT ? , ? "
    const [result] = await db.query(sql,[resultFollowListIid.slice(0),firstNum,pageNum])
    return result
  }
}
module.exports = UsersTrack;

//item 新增修改
const db = require(__dirname + "/../modules/mysql2-connect");

class Home {
  constructor(data) {
    let defaultData = {
      // oListId: null,  //訂單流水編號
      // oId: 0,  //訂單編號
      // iId: 0, //商品編號
      // oListName: '', //商品名稱
      // oListPrice:0, //商品單價
      // oQty: 0  //商品數量
      iId: 0, //商品編號
      iName: "", //商品名稱
      iImg: "[]", //商品圖片
      iDiscr: "", //商品簡介
      iprice: 0, //商品價格
    };
    this.data = { ...defaultData, ...data };
  }

  async save() {
    if (!this.data.iId) {
      let sql = "INSERT INTO `items` SET ?";
      let [result] = await db.query(sql, [this.data]);
      if (result.insertId) {
        this.data.iId = result.insertId;
        return this.data;
      } else {
        return false;
      }
    } else {
      // const o = {...this.data};
      // delete o.oListId;
      let sql = "UPDATE `items` SET ? WHERE `iId`=?";
      let [result] = await db.query(sql, [this.data, this.data.iId]);
      if (result.changedRows) {
        return this.data;
      } else {
        return false;
      }
    }
  }
}

module.exports = Home;
//單純輸出home
//匯出home

//33行 db連線  db有含promiss  .query取資料  sql 我要的data  用 array接值  (跟mysql取資料得到的結果 為陣列)

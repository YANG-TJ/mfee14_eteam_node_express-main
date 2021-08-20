const db = require(__dirname + "/../modules/mysql2-connect");
class Home {
  constructor(data) {
    let defaultData = {
      iId: 0, //商品編號
      iName: "", //商品名稱
      iImg: "[]", //商品圖片
      iDiscr: "", //商品簡介
      iPrice: 0, //商品價格
    };
    this.data = { ...defaultData, ...data };
  }

  //新品介紹
  async save() {
    let sql = "SELECT *   FROM   `items` order by `created_at` desc limit 6";
    let [result] = await db.query(sql);
    return result;
  }

  //咖啡類
  async readCoffee() {
    let sql1 = "SELECT *   FROM   `items` order by `created_at` limit 5";
    let [result1] = await db.query(sql1);
    return result1;
  }
}

module.exports = Home;
//單純輸出home
//匯出home
//33行 db連線  db有含promiss  .query取資料  sql 我要的data  用 array接值  (跟mysql取資料得到的結果 為陣列)

//這個code是只有用orders_list查所以資料 ， 因為不能做新增刪除和修改 01
const db = require(__dirname + "/../modules/mysql2-connect");

class Home {
  constructor(data) {
    let defaultData = {
      oListId: "", //訂單流水編號
      oId: "", //訂單編號
      iId: "", //商品編號
      oListName: "", //商品名稱
      oListPrice: "", //商品單價
      oQty: "", //商品數量
      // iName: '',  //商品名稱
      // iImg: '[]',   //商品圖片
      // iDiscr: '', //商品簡介
      // iprice: '' //商品價格
    };
    this.data = { ...defaultData, ...data };
  }

  // async save(){
  //     if(!this.data.oListId){
  //         let sql= "INSERT INTO `orders_list` SET ?";
  //         let [result]=await db.query(sql,[this.data]);
  //         if(result.insertId){
  //             this.data.oListId = result.insertId;
  //             return this.data;
  //         } else{
  //             return false;
  //         }
  //     }else{
  //         const o = {...this.data};
  //         delete o.oListId;
  //         let sql = "UPDATE `orders_list` SET ? WHERE `oListId`=?";
  //         let [result] = await db.query(sql, [o,this.data.oListId]);
  //         if(result.changedRows){
  //             return this.data;
  //         }else{
  //             return false;
  //         }
  //     }
  // }
}

module.exports = Home;
//單純輸出home
//匯出home

//33行 db連線  db有含promiss  .query取資料  sql 我要的data  用 array接值  (跟mysql取資料得到的結果 為陣列)

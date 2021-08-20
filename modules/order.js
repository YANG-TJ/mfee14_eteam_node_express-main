//test
class Order {
  // constructor(uAcco, subtotal, cNum, oAddress, oName, oPhone, oMail, iId,oQty,oListprice,oListName) {
  //   this.uAcco = 0;
  //   data.order.oPrice = oPrice;
  //   data.order.oAddress = oAddress;
  //   data.order.oName = oName;
  //   data.order.oPhone = oPhone;
  //   data.order.oMail = oMail;
  //   data.order.cNum = cNum;
  //   data.orderList.iId = iId;
  //   data.orderList.oListName = oListName;
  //   data.orderList.oListprice = oListprice;
  //   data.orderList.oQty = oQty;
  // }

  constructor(data) {
    let dafaultData = {
      order: {
        oId:null,
        uAcco: "",
        oPrice: "",
        cNum: "",
        oAddress: "",
        oName: "",
        oPhone: "",
        oMail: "",
      },
      orderList:[{
        oListId:null,
        iId:'',
        oListName:'',
        oListprice:'',
        oQty:'',
      }]
    };
    this.data={...defaultData, ...data}
  }


  async addOrderSQL(uId){
    if(uId){
      const sqluAcco="SELECT `uAcco` FROM `users` WHERE `uId`=?";
      const[resultuAcco]= await db.query(sqluAcco,[uId]);
      console.log(resultuAcco);

      const sqlOrder = "SELECT * FROM `orders` WHERE uAcco IN(?) " ;
      const [resultOrder] = await db.query(sqlOrder,[resultuAcco])

      return result
    }else{
      console.log(this.data)
    }

  }
  //尚未取得會員id
  // addOrderSQL() {
  //   let sql = `INSERT INTO orders( uAcco, oPrice, cNum, oAddress,  oName, oPhone, oMail, oDate) \
  //                  VALUES('${this.uAcco}', '${data.order.oPrice}',${data.order.cNum}', '${data.order.oAddress}','${data.order.oName}','${data.order.oPhone}','${data.order.oMail}',  NOW())`;

  //   let sql2 = `INSERT INTO orders_list(oListId, oId, oListName, oListPrice, oQty)\
  //                  VALUES('${data.orderList.iId}', '${data.orderList.oListName}', '${data.orderList.oListprice}','${data.orderList.oQty}'`;

  //   return sql, sql2;
  // }
}

//export default Order
module.exports = Order;

const db = require(__dirname + "/mysql2-connect");

const cartName = "step1";

// 購物車的內容
// [{iId:1, quantity:2}, {iId:2, quantity:3}]
class Cart {
  constructor(data) {
    let defaultData = {
      iId: null,
      pic: "",
      name: "",
      category: "",
      iPrice: "",
      iCount: "",
    };
    this.data = { ...defaultData, ...data };

    // this.iId = iId
    // this.pic = pic
    // this.name = name
    // this.category = category
    // this.iPrice = iPrice
    // this.iCount = iCount
    // this.login = 0
  }

  // 取得購物車的內容
  static getContents(session) {
    session[cartName] = session[cartName] || [];
    return session[cartName];
  }

  // 加入商品
//   static async add(session, itemSid=1, quantity = 1, sId=1 ) {
//     session[cartName] = session[cartName] || [];
//     const output = {
//       success: false,
//       cart: [],
//       res1: itemSid,
//     };
//     let cart = session[cartName];

//     // 檢查購物車裡是否已經有這項商品
//     let results = cart.filter((el) => +itemSid === el.iId && +sId === el.sId);
//     if (!results.length) {
//       // 如果沒有在購物車裡

//       // 檢查資料表有沒有這項商品
//       let sql =
//         "SELECT `i`.`iId`, `i`.`iImg`,`i`.`iName`, `s`.`sName`,`s`.`sPrice` FROM items AS `i` INNER JOIN specification AS `s` On `i`.`iId`=`s`.`iId` WHERE `i`.`iId`=? ";
//       let [rs] = await db.query(sql, [itemSid]);
//       if (rs && rs.length) {
//         cart.push({
//           ...rs[0],
//           quantity,
//           sId,
//         });
//         console.log(this.data)
//         cart.push;
//         output.success = true;
//       }
//     }

//     output.cart = Cart.getContents(session);
//     return output;
//   }

  //加入購物車
  static async addCart(session, iId, cartQty = 1) {
    session["cart"] = session["cart"] || [];
    const output = { success: false, cart: [] };
    let cart = [...session["cart"]];

    // 檢查購物車內是否有此項商品
    let result = cart.filter((element) => +iId === element.iId);
    if (!result.length) {
      let get_iId_sql = "SELECT `i`.`iId`, `i`.`iImg`,`i`.`iName`, `s`.`sName`,`s`.`sPrice` FROM items AS `i` INNER JOIN specification AS `s` On `i`.`iId`=`s`.`iId` WHERE `i`.`iId`=? ";
      let [iIdData] = await db.query(get_iId_sql, [iId]);

      // 若不在購物車內，檢查是否存在資料表中
      if (iIdData && iIdData.length) {
        cart.push({ ...iIdData[0], cartQty });
        output.success = true;
      }
    } else {
      // 傳址操作，result為一物件陣列，內部收到的物件為同址，修改傳址內容即等同於修改原物件
      result[0].cartQty += cartQty;
      output.success = true;
    }

    output.cart = cart;
    session["cart"] = cart;
    // console.log('查看前端反映',cartQty)
    return session;
  }

  // 變更商品數量
  static async update(session, itemSid, quantity = 1, sId) {
    session[cartName] = session[cartName] || [];
    const output = {
      success: false,
      cart: [],
    };
    let cart = session[cartName];

    let results = cart.filter((el) => +itemSid === el.iId);
    if (results.length) {
      let sql =
        "SELECT `s`.`iId`, `s`.`sName`,`s`.`sPrice` FROM specification AS `s` WHERE `s`.`sId`=? ";
      let [rs] = await db.query(sql, [itemSid]);

      results[0].quantity = quantity;
      results[0].sId = sId;
      results[0].sName =sName;
      output.success = true;
      output.cart = Cart.getContents(session);
      return output;
    } else {
      // 如果沒有這個商品就加入
      return await Cart.add(session, itemSid, quantity, sId);
    }
  }

  // 移除商品項目
  static remove(session, iId) {
    session["cart"] = session["cart"] || [];
    const output = {
      success: false,
      cart: [],
    };
    let cart =[... session["cart"]];
    console.log(cart)
    let oriLength = cart.length;
    session["cart"] = cart.filter((el) => +iId !== el.iId);

    if (session["cart"].length !== oriLength) {
      output.success = true;
    }
    output.cart = session['cart'];
    // session["cart"] = cart;

    // output.cart = Cart.getContents(session);
    return session;
  }

  // 清空購物車
  static clear(session) {
    session["cart"] = [];
    const output = {
      success: true,
      cart: [],
    };
    return output;
  }
}

module.exports = Cart;

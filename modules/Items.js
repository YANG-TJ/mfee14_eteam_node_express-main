const db = require(__dirname + "/../modules/mysql2-connect");

class Items {
  constructor(data) {
    let defaultData = {
      iCateId: 0,
      iId: 0,
      iName: "",
      iImg: "",
      iDiscr: "",
      cartQty: 0,
      iPrice: 0,
      created_at: "",
      updated_at: "",
    };

    this.data = { ...defaultData, ...data };
  }

  // 讀取單筆資料
  static async getProduct(iId) {
    if (!iId) return null;
    let get_iId_sql = "SELECT * FROM `items` WHERE `iId`=?";
    let specification_sql = `SELECT * FROM \`specification\` WHERE iId = ?`;

    let [get_iIdData] = await db.query(get_iId_sql, [iId]);
    let [specificationData] = await db.query(specification_sql, [iId]);
    if (!get_iIdData || !get_iIdData.length) return null;

    const iIdData = get_iIdData[0];

    return { iIdData, specificationData };
  }

  // 讀取多筆資料
  static async getRows(params = {}) {
    let perPage = params.perPage || 10; // 每頁幾筆
    let page = params.page || 1; // 查看第幾頁
    let iCateId = +params.iCateId || 0; // 分類編號
    // let keyword = params.keyword || ""; // 搜尋產品名稱或作者姓名
    let sort = params.sort || ""; // 排序

    let total_sql = `SELECT COUNT(1) num FROM \`items\``;
    let where_sql = " WHERE 1 ";

    if (iCateId) where_sql += " AND iCateId =" + iCateId;

    // if (keyword) {
    //     let k2 = db.escape("%" + keyword + "%");
    //     where += ` AND (author LIKE ${k2} OR bookname LIKE ${k2})`;
    // }

    // 省略default代表若找不到相符的case，則整段switch忽略
    let sortStr = "";
    switch (sort) {
      case "newToOld":
        sortStr = " ORDER BY created_at DESC ";
        break;
      case "oldToNew":
        sortStr = " ORDER BY created_at ASC ";
        break;
    }

    let [result1] = await db.query(total_sql + where_sql);
    let total = result1[0]["num"];

    let result2,
      totalPages = 0;
    if (total) {
      totalPages = Math.ceil(total / perPage);
      let result_sql = `SELECT * FROM \`items\` ${where_sql} ${sortStr} LIMIT ${
        (page - 1) * perPage
      }, ${perPage}`;
      [result2] = await db.query(result_sql);
    }
    console.log("total", total);
    return { total, totalPages, perPage, page, params, result2 };
  }

  //加入購物車
  static async addCart(session, iId, cartQty = 1) {
    session["cart"] = session["cart"] || [];
    const output = { success: false, cart: [] };
    let cart = [...session["cart"]];

    // 檢查購物車內是否有此項商品
    let result = cart.filter((element) => +iId === element.iId);
    if (!result.length) {
      let get_iId_sql = "SELECT * FROM `items` WHERE `iId`=?";
      let [get_iIdData] = await db.query(get_iId_sql, [iId]);

      // 若不在購物車內，檢查是否存在資料表中
      if (get_iIdData && get_iIdData.length) {
        cart.push({ ...get_iIdData[0], cartQty });
        output.success = true;
      }
    } else {
      // 傳址操作，result為一物件陣列，內部收到的物件為同址，修改傳址內容即等同於修改原物件
      result[0].cartQty += cartQty;
      output.success = true;
    }

    output.cart = cart;
    session["cart"] = cart;

    return session;
  }
}

module.exports = Items;

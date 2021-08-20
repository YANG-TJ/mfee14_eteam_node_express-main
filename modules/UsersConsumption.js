const db = require("./mysql2-connect");

const moment = require("moment-timezone");

class UsersConsumption {
  constructor(data) {
    let defaultData = {
      uAcco: null,
      old: "",
      iImg: "",
      oListName: "",
      sName: 0,
      oQty: 0,
      iPrice: 0,
      oListPrice: 0,
      oDate: "1970-01-01",
    };
    this.data = { ...defaultData, ...data };
  }
  // 一開始顯示的資料
  async readUsersConsumption(uAcco) {
    if (uAcco) {
      const sql =
        "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? AND `sName`='200g' ";
      const [result] = await db.query(sql, [uAcco]);
      //  時間顯示 = moment(設定時間).format(時間格式)
      // return result[1].oDate = moment(result[1].oDate).format(
      //   "YYYY-MM-DD"
      // )
      for (let i = 0; i < result.length; i++) {
        result[i].oDate = moment(result[i].oDate).format("YYYY-MM-DD");
      }
      return result;
    } else {
      return false;
    }
  }
  // orderBy
  async OrderByUsersConsumption(uAcco, value) {
    if (uAcco && value) {
      switch (value) {
        case "1":
          const sql1 =
            "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? AND `sName`='200g' ORDER BY `oDate` ASC";

          const [result1] = await db.query(sql1, [uAcco]);

          for (let i = 0; i < result1.length; i++) {
            result1[i].oDate = moment(result1[i].oDate).format("YYYY-MM-DD");
          }

          return result1;
        case "2":
          const sql2 =
            "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? AND `sName`='200g' ORDER BY `oDate` DESC";
          const [result2] = await db.query(sql2, [uAcco]);

          for (let i = 0; i < result2.length; i++) {
            result2[i].oDate = moment(result2[i].oDate).format("YYYY-MM-DD");
          }
          return result2;
        case "3":
          const sql3 =
            "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? ORDER BY `oListPrice` ASC";
          const [result3] = await db.query(sql3, [uAcco]);
          for (let i = 0; i < result3.length; i++) {
            result3[i].oDate = moment(result3[i].oDate).format("YYYY-MM-DD");
          }
          return result3;
        case "4":
          const sql4 =
            "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? ORDER BY `oListPrice` DESC";
          const [result4] = await db.query(sql4, [uAcco]);
          for (let i = 0; i < result4.length; i++) {
            result4[i].oDate = moment(result4[i].oDate).format("YYYY-MM-DD");
          }
          return result4;
      }
    } else {
      return false;
    }
  }

  // 搜尋 join太多張  取消作業
  async SearchUsersConsumption(keyword) {
    let where = "WHERE 1";
    const sql = `SELECT orders.oId,iImg,oListName,sName,oQty,iPrice,oListPrice,oDate FROM items JOIN orders_list ON items.iId = orders_list.iId JOIN orders ON orders_list.oId = orders.oId JOIN specification ON items.iId =specification.iId ${where}`;

    if (keyword) {
      // escape 跳脫字元用的
      let k2 = db.escape("%" + keyword + "%");
      where += ` AND (orders.oId LIKE ${k2} OR iImg LIKE ${k2}OR oListName LIKE ${k2}OR sName LIKE ${k2}OR oQty LIKE ${k2}OR iPrice LIKE ${k2}OR oListPrice LIKE ${k2}) `;
    }
    const [result] = await db.query(sql, [uAcco]);
  }
  // 頁數
  async pageUsersConsumption(uAcco,firstNum,pageNum){
    const sql = "SELECT `orders`.`oId`,`iImg`,`oListName`,`sName`,`oQty`,`iPrice`,`oListPrice`,`oDate`FROM `items`JOIN `orders_list`ON `items`.`iId` = `orders_list`.`iId`JOIN `orders`ON `orders_list`.`oId` = `orders`.`oId`JOIN`specification`ON`items`.`iId`=`specification`.`iId`WHERE `orders`.uAcco = ? LIMIT ? , ?";
    const[result]=await db.query(sql,[uAcco,firstNum,pageNum])

    for (let i = 0; i < result.length; i++) {
      result[i].oDate = moment(result[i].oDate).format("YYYY-MM-DD");
    }
    return result
  }
}

module.exports = UsersConsumption;

//   let perPage =  5;  // 每頁有幾筆
//   let page =  1;  // 查看第幾頁
//   let keyword = '';  // 搜尋產品名稱或者作者姓名
//   let orderBy = '';  // 排序
//   let where = ' WHERE 1 '; //呈現所有資料(不設條件)

//   if(keyword){
//     // escape 跳脫字元用的
//     let k2 = db.escape('%' + keyword + '%');
//     where += ` AND (author LIKE ${k2} OR bookname LIKE ${k2}) `;
// }

// let orderStr = '';
// switch(orderBy){
//     case 'price':
//     case 'price-asc':
//         orderStr = ' ORDER BY `price` ASC ';
//         break;
//     case 'price-desc':
//         orderStr = ' ORDER BY `price` DESC ';
//         break;
//     case 'pages':
//     case 'pages-asc':
//         orderStr = ' ORDER BY `pages` ASC ';
//         break;
//     case 'pages-desc':
//         orderStr = ' ORDER BY `pages` DESC ';
//         break;
// }

// let t_sql = `SELECT COUNT(1) num FROM \`products\` ${where}`;
//     let [r1] = await db.query(t_sql);
//     let total = r1[0]['num'];

//     let r2, totalPages=0;
//     if(total){
//         totalPages = Math.ceil(total/perPage);
//         let r_sql = `SELECT * FROM \`products\` ${where} ${orderStr} LIMIT ${(page-1)*perPage}, ${perPage}`;
//         [r2] = await db.query(r_sql);
//     }
//     return {
//         total,//資料總筆數
//         totalPages,//總頁數
//         perPage,// 每頁有幾筆
//         page,// 查看第幾頁
//         params,//自帶引數
//         data: r2,//讀取後的資料
//     }

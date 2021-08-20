//01

// const db = require(__dirname + '/../modules/mysql2-connect');
// //是一個模組把很多複雜的functio n 路由再取funstion的代號
// // 用sql向dataBass取資料
// // 他就像是一個function 之後會將資料傳給 routes的 home.js
// // 類別一定要大寫，名子取甚麼都可以
// //crud
// //!!!!!!!!!!  類別的第一個字一定要大寫!!!!!!!!!!!!類別
// class Home {
//     constructor(data) {
//         let defaultData = {
//             oListId: '',  //訂單流水編號
//             oQty: '',  //商品數量
//             oId: '',  //訂單編號
//             oListName: '', //訂單內容流水號
//             iId: '', //商品編號
//             iname: '',  //商品名稱
//             iImg: '[]',   //商品圖片
//             iDiscr: '', //商品簡介
//             iprice: '' //商品價格
//         };
//         this.data = { ...defaultData, ...data };
//         //這只是宣告!!!!
//         //將class Home裡面的data(初始值)，當使用者填入新資料時會用...data(覆蓋值)去覆蓋
//     }

// //除純:新增或修改
// //沒有金鑰匙就是 key是falsely家族，沒有值得狀態才是沒有金鑰匙
//     async save(){
//     if (!this.data.oListId) {
//         let sql = "INSERT INTO `items` SET ?";
//         let [result] = await db.query(sql, [this.data]);
//         //29.把新增的東西+?號傳給RESULT,[]為了是SQL與法一定要用陣列去包他
//         //inserId是新增的 只要有新增了一份ID他就會丟進去舊的ID 只要有新增就會覆蓋9~18
//         if (result.inserId) {
//             this.data. oListId = result.insertId;
//             //把RESULT的KEY丟到 this.data. oListId
//             return this.data;
//         } else {
//             return false;//新增失敗情況
//         }
//         //如果 S已經有值就更新
//     } else {
//         const o = { ...this.data };
//         delete o.oListId;
//         let sql = "UPDATE`products`SET?WHERE`oListId`=?";
//         let [result] = await db.query(sql, [o, this.data.oListId]);
//         //給他一ㄍ新的值  45.有幾個問號丟幾個值給他? []  ?? [,]  ??? [,,]
//         // let [result] = await db.query(sql, [this.data, this.data.uId]);
//         if (result.changeRows) {
//             return this.data;
//         } else {
//             return false; //沒有修改
//         }
//     }

// }

// module.exports = Home;
// //單純輸出home
// //匯出home

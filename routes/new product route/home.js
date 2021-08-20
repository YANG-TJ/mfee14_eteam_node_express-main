//路由是node網站的框架
//路由設定 小寫
const db = require(__dirname + '/../modules/mysql2-connect');
const express = require("express");


const router = express.Router(); //他是一個function
//用express的框架裡的router，express裡面的路由工具 

const Home=require(__dirname+"/../modules/Home")
// 引入modules/home裡的sql方法
//dirname是本地端資料夾的位置 絕對路徑
//路由連  sql向dataBass取資料(他只是取資料) 有路由才有連線 /拿它去連modules

//取的所有商品+篩選
router.get("/", async (req, res) => {
  res.json([req.baseUrl, req.url]); //測試noded.js環境
}); //baseUrl=跟目錄   //req.url=目前目錄
//後端通過路由來拿取前端的req資料，之後在res回去
//接收前端來的req然後在在responce回去

//新增商品測試 /home/add
router.get("/read", async (req, res) => {

  const p1 = new Home({
    //new Home是實體化
    // iName: '嗨',  //商品名稱
    // iDiscr: '嗨嗨嗨xsaxs嗨', //商品簡介
    // iImg: '20210514120999.jpg', //商品簡介
  });
  const obj1 = await p1.save();
  //await就像是帳號密碼,等待帳號密碼輸入才會執行後面
  //!!!!await先執行再到async
  res.json(obj1);

});

module.exports = router;
//單傳輸出這ㄍ

//module 模組(home.js)
//等號右手邊只向左邊
//把又邊的東西丟給左邊

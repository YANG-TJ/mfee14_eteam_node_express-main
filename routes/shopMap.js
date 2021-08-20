const express = require("express");
const router = express.Router(); // 透過express套件，建立router物件
const ShopInfo = require(__dirname + "/../modules/ShopMap");

// 撈取全部的店家資料
router.get('/', async (req, res, next) => {
    let shops = await ShopInfo.getAllShopInfo()
    res.json(shops);
  })

module.exports = router;

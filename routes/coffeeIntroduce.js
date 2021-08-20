const express = require("express");
const router = express.Router(); // 透過express套件，建立router物件
const CoffeeIntroduce = require(__dirname + "/../modules/CoffeeIntroduce");

// 撈取相關產品資料
router.get("/relatedItems", async (req, res, next) => {
    let relatedItems = await CoffeeIntroduce.getAllRelatedItems();
    res.json(relatedItems);
});

// 撈取全部的產地資料
router.get("/", async (req, res, next) => {
    let origins = await CoffeeIntroduce.getAllOriginMarker();
    res.json(origins);
});

module.exports = router;

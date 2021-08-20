const express = require("express");
const router = express.Router(); // 透過express套件，建立router物件
const Partners = require(__dirname + "/../modules/Partners");

// 更新店家Layout資料
router.put("/update", async (req, res) => {
    // 先透過店家ID，取得店家的物件實體
    const pInstance = await Partners.getPartnerInstance(5);
    if (req.body.detailTextField || req.body.detailLayoutsData) {
        pInstance.data.pDetailPageText = JSON.stringify(req.body.detailTextField);
        pInstance.data.pDetailPageLayout = JSON.stringify(req.body.detailLayoutsData);
    } else {
        pInstance.data.pMenuPageText = JSON.stringify(req.body.menuTextField);
        pInstance.data.pMenuPageLayout = JSON.stringify(req.body.menuLayoutsData);
    }
    console.log('req.body',req.body)
    // 呼叫儲存用的函式
    const resultObj = await pInstance.savePartnerData();

    res.json(resultObj);
});

// 取得店家資料的路由
router.get("/:pId", async (req, res) => {
    let p = await Partners.getOneRow(req.params.pId);
    res.json(p);
});

module.exports = router;

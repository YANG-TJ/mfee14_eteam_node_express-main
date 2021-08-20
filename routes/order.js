//sql語法有錯
const express = require("express");
const db = require(__dirname + "/../modules/mysql2-connect");
const router = express.Router();
// const upload = require(__dirname + "/../modules/upload-img");

router.post("/add", async (req, res, next) => {
  // 測試response，會自動解析為物件
  // console.log(typeof req.body)
  // console.log(req.body)

  //從request json 資料建立新的物件
  let output = {
    sucess: false,
    error: "",
    insertId: 0,
  };

  const sql1 = "INSERT INTO `orders` SET? ";
  const [results1] = await db.query(sql1, [
    {
      oId: null,
      uAcco: req.body.order.uAcco,
      oPrice: req.body.order.oPrice,
      cNum: req.body.order.cNum,
      oAddress: req.body.order.oAddress,
      oName: req.body.order.oName,
      oPhone: req.body.order.oPhone,
      oMail: req.body.order.oMail,
    },
    // console.log("order", req.body),
  ]);
  // console.log("results1:", [results1]);

  //解析出 oId
  const rsoId = Object.values(JSON.parse(JSON.stringify(results1)))[2];
  // console.log("rsoId", rsoId); 


    for (let item of req.body.orderList) {
      const sql = "INSERT INTO `orders_list` SET?";
      const [result] = await db.query(sql, [item]); //產生 orderList
      const sql3="UPDATE `orders_list` SET `oId`=? WHERE `oId`=0 " //將該訂單詳細增加總表的 oId
      const [result2] = await db.query(sql3, [rsoId]);

      // console.log("orderList", req.body);
    }
  output = { ...output, body: req.body };
  res.json(output);
});
module.exports = router;

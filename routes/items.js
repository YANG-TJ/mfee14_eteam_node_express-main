const express = require("express");
const router = express.Router(); // 透過express套件，建立router物件
const Items = require(__dirname + "/../modules/Items");

// 購物車
router.get("/session", async (req, res) => {
  const { iId, cartQty } = req.query;
  let cartData = await Items.addCart(req.session, iId, +cartQty);

  res.json(req.session);
  // res.json((req.session["cart"].length = 0));
});

router.get("/info/:iId", async (req, res) => {
  let iIdData = await Items.getProduct(req.params.iId);

  res.json(iIdData);
});

// router.get("/:page", async (req, res) => {
//   let pageData = await Items.getRows({ page: req.params.page });

//   res.json(pageData);
// });

router.get("/", async (req, res) => {
  let data = await Items.getRows(req.query);
  console.log(req.query);

  res.json(data);
});

module.exports = router;

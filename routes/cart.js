const express = require('express');

const Cart = require(__dirname + '/../modules/Cart');

const router = express.Router();


// 取得購物車的內容
router.get('/cart', async (req, res)=>{
    res.json(req.session['cart']);
    console.log('取得session',req.session);
    // console.log('取得session',req.session['cart']);

});

//加入session
router.get("/session", async (req, res) => {
    const { iId, cartQty } = req.query;
    let cartData = await Cart.addCart(req.session, iId, +cartQty);
  
    res.json(cartData);
    // console.log(cartData)
    // console.log('數量',cartQty)
    // res.json((req.session["cart"].length = 0));
  });


// 修改數量(origin)
// router.get('/update', async (req, res)=>{
//     const {iId, quantity} = req.query;

//     res.json( await Cart.update(req.session, iId, quantity) );
// });

// 修改數量、規格
router.get('/update', async (req, res)=>{
    const {iId, quantity, sId,} = req.query;
    
    res.json( await Cart.update(req.session, iId, quantity,sId) );
});

// 移除項目
router.get('/session/remove/:iId', async (req, res)=>{
    const { iId } = req.params;
    let cartData = await Cart.remove(req.session, iId)
    res.json( req.session);
    console.log('移除',req.session)
});

// 清空
router.get('/session/clear', async (req, res)=>{
    res.json( Cart.clear(req.session) );
});

module.exports = router;
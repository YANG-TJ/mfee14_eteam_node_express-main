const express = require('express');

const Credit = require(__dirname + '/../modules/Credit');

const router = express.Router();


// 取得購物車的內容
router.get('/', async (req, res)=>{
    res.json(Cart.getContents(req.session));
});

// 加入商品
router.get('/add', async (req, res)=>{
     const { itemSid, quantity=1,sId=1} = req.query;
    let step1 =new Cart(
        req.body.iId,
        req.body.pic,
        req.body.name,
        req.body.category,
        req.body.iPrice,
        req.body.iCount
    );

    // res.json( await Cart.add(req.session, iId, quantity) );
    res.json( await Cart.add(req.session,step1) );
});

// 修改數量(origin)
// router.get('/update', async (req, res)=>{
//     const {iId, quantity} = req.query;

//     res.json( await Cart.update(req.session, iId, quantity) );
// });

// 修改數量、規格
router.get('/update', async (req, res)=>{
    const {iId, quantity, sId} = req.query;
    
    res.json( await Cart.update(req.session, iId, quantity,sId) );
});

// 移除項目
router.get('/remove/:iId', async (req, res)=>{
    res.json( Cart.remove(req.session, req.params.iId) );
});

// 清空
router.get('/clear', async (req, res)=>{
    res.json( Cart.clear(req.session) );
});

module.exports = router;
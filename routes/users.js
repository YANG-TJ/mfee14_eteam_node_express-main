// users 路由
const express = require("express");

const router = express.Router();
// 專門寫sql  Users
const Users = require(__dirname + "/../modules/Users.js");

// 專門寫sql  UsersConsumption
const UsersConsumption = require(__dirname + "/../modules/UsersConsumption.js");
// 專門寫sql  UsersTrack
const UsersTrack = require(__dirname + "/../modules/UsersTrack.js");
// 專門寫sql  UsersCreaditCard
const UsersCreditCard = require(__dirname + "/../modules/UsersCreditCard.js");
//  專門寫sql  UsersDiscount
const UsersDiscount = require(__dirname + "/../modules/UsersDiscount.js");
// 專門寫sql Message
const Message = require(__dirname + "/../modules/Message.js");

// mysql2 async-await用的
const db = require(__dirname + "/../modules/mysql2-connect.js");
// 加密用
const bcrypt = require("bcryptjs");
// token用
const jwt = require("jsonwebtoken");
// 忘記密碼  寄信用
const nodeMailer = require("nodemailer");
const fs = require("fs");
const date = new Date();
const year = date.getFullYear();
const month =
  date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
const timeStr = `${year}${month}${day}`;
// console.log(timeStr); //20210719

// 上傳檔案專用
const upload = require(__dirname + "/../modules/upload-img.js");
// 日期設定
const moment = require("moment-timezone");

// 登入(將資料以 token 存在localStoreage 內)

router.post("/login", async (req, res) => {
  // 宣告一物件

  const output = {
    success: false,
    code: 0,
    error: "帳號或密碼錯誤",
    body: req.body,
  };

  if (!req.body.uAcco || !req.body.uPwd) {
    return res.json(output);
  }

  const sql = "SELECT * FROM users WHERE `uAcco`= ? ";
  const [usersloginSql] = await db.query(sql, [req.body.uAcco]);

  if (!usersloginSql.length) {
    output.code = 100;
    output.error = "無此帳號";
    return res.json(output);
  }

  // 將bcryptjs 後 存在database的密碼解密
  const userslogin = usersloginSql[0];

  

  // 比對 bcypt.compare(輸入密碼,hash後的密碼(當下已存在資料庫))
  const result = await bcrypt.compare(req.body.uPwd, userslogin.uPwd);

  if (!result) {
    output.code = 300;
    output.error = "密碼錯誤";
    return res.json(output);
  }

  // 將存放uId、uAcco、uPwd 於token

  const { uId, uAcco, uPwd } = userslogin;
  // token = jwt.sign({要存的資料},token的key,{expiresIn:"可保留毫秒數"})
  output.token = jwt.sign({ uId, uAcco, uPwd }, process.env.TOKEN_SECRET); //三分鐘,{expiresIn:"180000"}
  output.success = true;
  output.code = 400;
  output.error = "成功登入";
  output.body = userslogin;

  res.json(output);
});

router.post("/logout", (req, res) => {
  // return res.json(req.body)

  if (req.body.token) {
    res.send(true);
  } else {
    res.send(false);
  }
});

// token 驗證功能(測試用)
router.post("/jwt-verify", (req, res) => {
  // return res.json(req.body.token);
  let payload;
  try {
    // 解析token  jwt.verify(req.body.token, process.env.TOKEN_SECRET)
    payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
    // console.log(payload);
    return res.json(payload);
  } catch (ex) {
    return res.json({
      // .toString(進位制字串)可以將所有的的資料都轉換為字串，但是要排除null 和 undefined
      // String()可以將null和undefined轉換為字串，但是沒法轉進位制字串
      error: ex.toString(),
    });
  }
});

// 忘記密碼  寄信功能

// 資料比對
router.post("/checkUacco", async (req, res) => {
  // return res.json(req.body.uAcco)
  const output = {
    success: false,
    code: 0,
    error: "帳號或信箱錯誤",
    body: req.body,
  };

  if (req.body.uAcco==="" || req.body.uMail==="") {
    return res.json(output);
  }
  // console.log(req.body.uAcco);
  // return res.json(req.body.uAcco);
  // 這裡要用 try catch 以避免程式 錯誤
  try {
    const sql = "SELECT * FROM `users` WHERE `uAcco` = ? AND `uMail` = ?";
    const [result] = await db.query(sql, [req.body.uAcco, req.body.uMail]);
    // console.log(result[0].uAcco); //Amos55555

    if (result.length < 0) {
      output.code = 100;
      output.error = "帳號或信箱錯誤";
      return res.json(output); // 帳號或信箱錯誤
    }

    const uAcco = result[0].uAcco;
    const uName = result[0].uName;
    const uMail = result[0].uMail;
    const uPwd = "123456"; 
    const hash = bcrypt.hashSync(`${uPwd}`, 10);
    // 更改database用戶密碼
    const updatePwdSql = "UPDATE `users` SET `uPwd`= ? WHERE `uAcco` = ?";
    const [updatePwdResult] = await db.query(updatePwdSql, [hash, uAcco]);
    console.log(updatePwdResult[0]);

    // 寄出信件給使用者
    // generate mail template
    //  htmlMail整個信件內容
    let htmlMail = "";
    // 表示我們將顯是一個有序清單
    htmlMail += "<div>"; //<ol>

    // read mail content from file
    // 利用fs模組去讀取template.txt檔
    const mailContent = fs
      // 利用readFileSync函式，第一個參數為要讀取的檔案名稱，第二個參數則是以什麼編碼打開(這裡用的是utf-8)
      .readFileSync("./template.txt", "utf8")
      // 用split函式，以換行符為分割點，將字串分割成一個陣列(split會返回一個陣列)
      .split("\r\n")
      // 以filter函式，將陣列裡的每個以雙斜線開頭的元素過濾掉。filter一樣會返回一個陣列
      .filter((e) => !e.startsWith("//"))
      // 以map函式，將陣列裡的每個元素改造成我們要發送的內容。用html的<li>以及<p>標籤包覆，讓我們的信件內容以清單顯示。map會返回一個陣列
      .map((line) => `<p>${line}</p>`)
      // 最後再以join函式，將這個陣列裡的所有內容，全部拼接成一個字串
      .join("");
    console.log(mailContent);
    // 把信件內容加到我們htmlMail變數裡，並關上<ol>標籤(</ol>)
    htmlMail += mailContent;
    htmlMail += "</div>"; //</ol>
    // nodeMailer變數，呼叫它的createTransport函式去定義我們要使用的電子郵件服務。
    // 寄信者
    // 在gmail 中要記得打開低安全性https://myaccount.google.com/u/1/lesssecureapps?pli=1&rapt=AEjHL4OCgEVNrrCqaZ7tCeL43S_cv0Mi0HV-8cyG6kCVRgBebl8bQgRV405gP-c1HBxoZ59O2g6Bc6bAPDVR1Yf3p8UM2sKyUw
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "t2112657@gmail.com",
        pass: "abc0958972421",
      },
    });
    // mailOptions變數，這個變數是一個物件，裡面就是我們要發送的信件內容，收件者，寄件者，以及信件標題等等。前面從文檔讀取內容，拼裝成html格式的字串，以及時間等等，就是要塞在這裡用的。
    const mailOptions = {
      from: "t2112657@gmail.com",
      to: uMail, // list of receipients 收件者
      subject: `親愛的${uName}先生/小姐-${timeStr}`, //${timeStr}寄送日期 //標題
      html: htmlMail, //信件內容
    };
    // 利用createTransPort返回的物件，也就是transporter變數，調用sendMail函式。sendMail函式的第一個參數為我們要發送的信件，第二個參數則是一個回呼函式；當sendMail執行完獲取結果之後，會執行第二個參數定義的回呼函式。這裡就簡單把我們送出去的內容以及時間，打印到控制台。
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      if (info) {
        console.log(`Done sending!, time: ${timeStr}`, info);
        output.success = true;
        output.error = "";
        res.json(output);
      } else {
        output.code = 300;
        output.error = "信箱寄送失敗";
        return res.json(output); //信箱寄送失敗
      }
    });
  } catch (e) {
    console.log(e.message);
    res.json(e.message);
  }
});

// 會員資料  讀取功能
// 動態id寫法
// users/usersText/123354(使用者id)
router.post("/usersText", async (req, res) => {
  // const sql = "SELECT * FROM `users` WHERE `uId`= ? ";
  // const [result]= await db.query(sql ,[req.body.uId]);
  // res.json("Hello");
  // get 取值 req.params.uId 將直放在 路由(/:uId)
  // return res.json(req.body)
  // 從token 取uId
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload.uId)
  req.body.uId = payload.uId;

  let data = await Users.readUserSQL(payload.uId);

  res.json(data);
});

// 註冊頁面 新增功能(變數)
router.post("/usersRegister", async (req, res) => {
  // return res.json(req.body)
  // console.log(req.body);

  // 如果涵式中定義的區域變數與全域變數名稱相同，則區域變數會隱藏全域變數

  // uPwd 加密功能
  // 直接執行方法
  // let {uPwd} = req.body;
  const hash =  bcrypt.hashSync(`${req.body.uPwd}`, 10);

  // let req.body[uPwd] = hash;
  // 可用postman 看變化
  // return(res.json(hash))

  req.body.uPwd = hash;
  // 刪除重複確認的欄位
  delete req.body.uChkPwd;

  const users = new Users({
    ...req.body,
  });
  // return(res.json(users))

  let data = await users.addUserSQL();

  // 將token 傳回去(因為uId 為dataBase 自動產生，無法直接取得值，故註冊完成後，請重新登入)
  // const {uId,uAcco,uPwd} = data;

  // let token = jwt.sign({uId, uAcco, uPwd }, process.env.TOKEN_SECRET);

  res.json(data);
});
// users編輯-1 (顯示原資料)
router.post("/usersEdit", async (req, res) => {
  // 從token 取uId
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  const data = await Users.readUserSQL(payload.uId);
  res.json(data);
});

// users編輯-2 (更新資料)
router.put("/usersEdit", async (req, res) => {
  // 判斷密碼長度至少6位元以上
  let uPwdstring = req.body.uPwd;
  console.log(uPwdstring.length);
  if(uPwdstring.length<6 ){return res.json(false)}

  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload.uId);

  const hash = bcrypt.hashSync(`${req.body.uPwd}`, 10);
  req.body.uPwd = hash;
  // return res.json(req.body.uPwd)
  // 把存在token 的uId 賦予給req.body.uId
  req.body.uId = payload.uId;
  delete req.body.token;
  const users = new Users({
    ...req.body,
  });

  // return res.json(users);
  const data = await users.updateUserByIdSQL(payload.uId);

  res.json(data);
});

// 編輯-3 上傳檔案(圖片) 單張
router.post("/usersEditImg", upload.single("image"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // return res.json(req.file.token)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);

  console.log(payload);

  req.body.uId = payload.uId;
  delete req.body.token;
  const users = new Users({
    ...req.body,
    ...req.file.filename,
  });

  const data = await users.usersEditImgUpload(req.file.filename, payload.uId);

  // res.json({
  //       filename: req.file && req.file.filename,
  //       body: req.body,
  //     });
  res.json(data);
});

// 會員消費紀錄usersConsumption
router.post("/usersConsumption", async (req, res) => {
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // 因為訂單表連結是設定uAcco當 index key
  req.body.uAcco = payload.uAcco;
  // return res.json(payload.uAcco)
  delete req.body.token;

  const usersConsumption = new UsersConsumption({
    ...req.body,
  });
  const data = await usersConsumption.readUsersConsumption(payload.uAcco);

  res.json(data);
});

// 會員消費紀錄  排序
router.post("/usersConsumptionOrderBy",async(req,res)=>{

  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(req.body[0]) // option 內的value
  // console.log(req.body[0]);
  const value = req.body[0];
  req.body.uAcco = payload.uAcco;
  delete req.body.token;
  const usersConsumption = new UsersConsumption({
    ...req.body
  });
  // return res.json(req.body[0]);

  const data = await usersConsumption.OrderByUsersConsumption(payload.uAcco,value);

  res.json(data);

})

// 會員消費紀錄 分頁功能

// 要有的資訊
// {
  // 每頁有幾筆
  // 查看第幾頁
  // 資料總筆數
  // 總頁數 = 資料總筆數/每頁有幾筆
  // 讀取後的資料
// }
router.post("/usersConsumptionPage",async(req,res)=>{
  // return res.json(req.body)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload)
  req.body.uAcco = payload.uAcco;
  delete req.body.token;

  const page = Number(req.body[0]); //第幾頁
  // LIMIT ( (第幾頁-1)*每頁幾筆 , 每頁幾筆 )
  // console.log(page);
  const pageNum = 5;//每頁幾筆
  const firstNum = (page-1)*pageNum;//(第幾頁-1)*每頁幾筆
  
 

  const usersConsumption = new UsersConsumption({
    firstNum,page,pageNum
  });

  const data = await usersConsumption.pageUsersConsumption(payload.uAcco,firstNum,pageNum);

  res.json(data);


})

// 會員消費紀錄  搜尋 (取消作業)

router.post("/usersConsumptionSearch",async(req,res)=>{
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uAcco = payload.uAcco;
  delete req.body.token;
  const usersConsumption = new UsersConsumption({
    ...req.body
  });
  const data = await usersConsumption.SearchUsersConsumption(payload.uAcco);

  res.json(data);

})

// 會員商品追蹤 usersTrack  讀取
router.post("/usersTrack", async (req, res) => {
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload)
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersTrack = new UsersTrack({
    ...req.body,
  });

  const data = await usersTrack.readUsersTrack(payload.uId);

  res.json(data);
});

// 會員商品追蹤 delete  刪除users 的followList欄位內的值
router.put("/usersDeleteTrack/:iId", async (req, res) => {
  // return res.json(req.body.iId)

  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(req.body) //1
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersTrack = new UsersTrack({
    ...req.body,
  });
  // return res.json(req.body)

  const data = await usersTrack.deleteUsersTrack(payload.uId, req.body.iId);

  res.json(data);
});

// 會員商品追蹤 分頁 Page
router.post("/usersTrackPage", async (req, res) => {
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload)
  req.body.uId = payload.uId;
  delete req.body.token;


  const page = Number(req.body[0]); //第幾頁
  // LIMIT ( (第幾頁-1)*每頁幾筆 , 每頁幾筆 )
  // console.log(page);
  const pageNum = 5;//每頁幾筆
  const firstNum = (page-1)*pageNum;//(第幾頁-1)*每頁幾筆
  

  const usersTrack = new UsersTrack({
    page,pageNum,firstNum,...req.body.uId
  });

  const data = await usersTrack.pageUsersTrack(payload.uId,firstNum,pageNum);

  res.json(data);
});

// 信用卡讀取  (依存在token 的uId)
router.post("/usersCreditCard", async (req, res) => {
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(payload)
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersCreditCard = new UsersCreditCard({
    ...req.body,
  });

  const data = await usersCreditCard.readUsersCreditCard(payload.uId);

  res.json(data);
});

// 刪除信用卡 (依存在token 的uId url的cId判斷)

router.delete("/usersDeleteCreditCard/:cId", async (req, res) => {
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(req.body)
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersCreditCard = new UsersCreditCard({
    ...req.body,
  });

  const data = await usersCreditCard.deleteUsersCreditCard(
    payload.uId,
    req.body.cId
  );

  res.json(data);
});

// 新增信用卡
router.post("/usersCreditCardAdd", async (req, res) => {
  // return res.json(req.body);
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  delete req.body.token;

  // return res.json(req.body);
  const usersCreditCard = new UsersCreditCard({
    ...req.body,
  });

  const data = await usersCreditCard.addUsersCreditCard();

  res.json(data);
});
// 編輯信用卡(單筆顯示)  
router.post("/usersCreditCardReadSingle", async (req, res) => {

  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  // return res.json(req.body)
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersCreditCard = new UsersCreditCard({
    ...req.body,
  });

  const data = await usersCreditCard.readSingleUsersCreditCard(
    payload.uId,
    req.body.cId
  );

  res.json(data);
});
// 編輯信用卡 

router.put("/usersCreditCardEdit", async (req, res) => {
  // return res.json(req.body.cId)

  const usersCreditCard = new UsersCreditCard({
    ...req.body,
  });

  const data = await usersCreditCard.editUsersCreditCard(req.body.cId);

  res.json(data);
});

// 折扣碼 (讀取)
// 尚未使用
router.post("/usersDiscountCanUse", async (req, res) => {
  // return res.json(req.body)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersDiscount = new UsersDiscount({
    ...req.body,
  });

  const data = await usersDiscount.CanUseDiscount(payload.uId);

  res.json(data);
});
// 已使用
router.post("/usersDiscountNotCanUse", async (req, res) => {
  // return res.json(req.body)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  delete req.body.token;
  const usersDiscount = new UsersDiscount({
    ...req.body,
  });

  const data = await usersDiscount.NotCanUseDiscount(payload.uId);

  res.json(data);
});
// 留言板 人物圖片
router.post("/usersImg", async (req, res) => {
  // return res.json(req.body)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  // return res.json(req.body.uId)
  delete req.body.token;
  const message = new Message({
    ...req.body,
  });

  const data = await message.usersImgMessage(payload.uId);

  res.json(data);
});
// 留言板 讀取 iId
router.post("/messageText/:iId", async (req, res) => {
  req.body.iId = 3; //測試用(要問以琳來源) req.params.iId

  const message = new Message({
    ...req.body,
  });
  // return res.json(req.body)
  const data = await message.readMessageText(req.body.iId);

  res.json(data);
});
// 留言板 新增
router.post("/messageAdd", async (req, res) => {
  //  return res.json(req.body)
  req.body.iId = 3; //測試用(要問以琳來源) 因為沒有input所以要來源 req.params.iId

  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  delete req.body.token;

  const message = new Message({
    ...req.body,
  });
  // return res.json(req.body)
  const data = await message.addMessageText();

  res.json(data);
});
// 點讚功能 將點過讚的uId 更新uLike欄位 return 1 點過的 更新uLike欄位 return -1 
router.put("/messagemlike",async(req,res)=>{
  // return res.json(req.body)
  let payload = jwt.verify(req.body.token, process.env.TOKEN_SECRET);
  req.body.uId = payload.uId;
  delete req.body.token;

  const message = new Message({
    ...req.body,
  });
  const data = await message.usersMlikeMessage(req.body.uId,req.body.mId);

  res.json(data);

})
// 計算所有數字儲存回 mLike

module.exports = router;

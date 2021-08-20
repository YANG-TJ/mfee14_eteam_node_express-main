//  引入上傳檔案用的 multer
const multer = require("multer");
const {v4: uuidv4} = require('uuid');
const moment = require("moment-timezone");

// 將許可的文件類型作成一個Obj
const extMap = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  // 檔案真正存放位置 destination
  destination: (req, file, cb) => {
    //   /../ 上一層的意思
    // cb(null, __dirname + "/../img");
    cb(null, __dirname + "/../public/img");
  },
  // 檔案名稱設定 filename
  filename: (req, file, cb) => {
    let ext = extMap[file.mimetype]; //副檔名
    cb(null, moment(Date.now()).format("YYYY-MM-DD") + file.originalname); //主檔名
    // file.originalname 保留原始副檔名
  },
});
// 確認檔案類型符合，就上傳成功，並回傳  true
const fileFilter = (req, file, cb) => {
  cb(null, !!extMap[file.mimetype]);
};

// 模組化  用Obj傳 storage,fileFilter
module.exports = multer({ storage, fileFilter });

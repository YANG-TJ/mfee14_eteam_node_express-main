const db = require(__dirname + "/../modules/mysql2-connect");

class ShopInfo {
    constructor(data) {
        let defaultData = {
            pId: "",
            pAcco: "",
            pPwd: "",
            pName: "",
            pTWId: "",
            pImg: "",
            pPhone: "",
            pAddr: "",
            pDiscr: "",
            pLat: 0,
            pLng: 0,
            pDetailPageText: "",
            pDetailPageLayout: "",
            pMenuPageText: "",
            pMenuPageLayout: "",
            recycleIndex: 0,
        };

        this.data = { ...defaultData, ...data };
    }

    // CRUD
    // 讀取全部店家資料
    static async getAllShopInfo() {
        let sql = "SELECT * FROM `partners`";
        let [result] = await db.query(sql);
        if (!result || !result.length) return null;
        return result;
    }

}

module.exports = ShopInfo;

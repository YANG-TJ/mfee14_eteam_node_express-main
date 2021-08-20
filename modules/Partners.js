const db = require(__dirname + "/../modules/mysql2-connect");

class Partners {
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
    // 讀取單筆資料
    static async getOneRow(pId) {
        if (!pId) return null;
        let sql = "SELECT * FROM `partners` WHERE `pId`=?";
        let [result] = await db.query(sql, [pId]);
        if (!result || !result.length) return null;
        return result[0];
    }

    // 創建店家物件實體
    static async getPartnerInstance(pId) {
        let row = await Partners.getOneRow(pId);
        return new Partners(row);
    }

    // 更新店家專頁資料
    async savePartnerData() {
        if (!this.data.pId) {
            return null;
        } else {
            // 若pId有值，就執行更新
            const obj = { ...this.data };
            delete obj.pId; // pId不更新
            let sql = "UPDATE `partners` SET ? WHERE `pId`=?";
            console.log(obj)
            let [result] = await db.query(sql, [obj, this.data.pId]);
            if (result.changedRows) {
                return this.data;
            } else {
                return false;
            }
        }
    }
}

module.exports = Partners;

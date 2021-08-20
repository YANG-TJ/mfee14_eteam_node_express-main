const db = require(__dirname + "/../modules/mysql2-connect");

class CoffeeIntroduce {
    constructor(data) {
        let defaultData = {
            originId: "",
            originName: "",
            originLat: "",
            originLng: "",
            originDiscr: "",
            originImg: "",
        };

        this.data = { ...defaultData, ...data };
    }

    // CRUD
    // 讀取全部產地資料
    static async getAllOriginMarker() {
        let sql = "SELECT * FROM `place_of_origin`";
        let [result] = await db.query(sql);
        if (!result || !result.length) return null;
        return result;
    }

    // 讀取相關產品資料
    static async getAllRelatedItems() {
        let sql = "SELECT * FROM `items` LIMIT 3";
        let [result] = await db.query(sql);
        if (!result || !result.length) return null;
        return result;
    }
}

module.exports = CoffeeIntroduce;

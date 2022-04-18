const _ = require('lodash');
var moment = require('moment');

const { batteryStock } = require('../app/models/batteryStock');
class stockUtility {

    // function to add new stock
    async addNewStock(data) {
        try {
            for (let i = 0; i < data.quantity; i++) {
                let stock = {
                    batteryId: data._id,
                    stockId: data.stockId,
                    companyId: data.companyId,
                    price: data.price
                }
                const btryStock = new batteryStock(stock);
                btryStock.save().then(result => {
                    // console.log('i = ' + i)
                    if (i + 1 == data.quantity)
                        // console.log('res')
                        // if (result) {
                        res.status(200).json({ success: true, message: "New values Saved successful!" });
                    // } else {
                    // res.status(200).json({ success: false, message: "values Not saved!" });
                    // }
                });

            }


        } catch (error) {
            //console.log(error)
            return error
        }
    }




}

module.exports = new stockUtility();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { Battery, validate } = require('../models/battery');

const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// route to add new battery
router.post("/addnew", auth, async (req, res, next) => {
    const battery = new Battery(req.body);
    // const { error } = validate(req.body);
    // if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await Battery.findOne({ title: req.body.title, companyId: req.body.companyId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    battery.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!", data: result });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all batteries
router.get('/all', async (req, res) => {
    Battery.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});



//get battery detail by battery id
router.get('/:id', auth, async (req, res) => {
    Battery.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});



//get battery with brand detail
router.get('/detail/:id', async (req, res) => {
    let batteryId = req.params.id;
    Battery.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(batteryId)
            }
        },
        { "$addFields": { "testId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'batterycompanies',
                localField: 'testId',
                foreignField: '_id',
                as: 'detail'
            }
        },
        {
            "$addFields": {
                "detail": {
                    "$arrayElemAt": ["$detail", 0]
                }
            }
        }
    ])
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "not found" });
            }
        })
});



//get multiple batteries with detail
router.get('/multiple/detail', async (req, res) => {
    let ids = req.query.ids;
    let allIds = JSON.parse(ids)
    Battery.find({ _id: { "$in": allIds } }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
})

// Battery.aggregate([
//     {
//         $match: {
//             _id: { "$in": [ids] }
//         }
//     },
//     { "$addFields": { "testId": { "$toObjectId": "$companyId" } } },
//     {
//         $lookup:
//         {
//             from: 'batterycompanies',
//             localField: 'testId',
//             foreignField: '_id',
//             as: 'detail'
//         }
//     },
//     {
//         "$addFields": {
//             "detail": {
//                 "$arrayElemAt": ["$detail", 0]
//             }
//         }
//     }
// ])



// route to update battery 
router.put("/:id", auth, async (req, res, next) => {
    const battery = await Battery.findById(req.params.id);
    req.body.updated_at = Date.now()

    let find = await Battery.findOne({ title: req.body.title, isDeleted: false, batteryId: { $ne: req.body.batteryId } });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    battery.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});



// route to update battery stock
router.put("/upateBatteryStock/:batteryId/:stockId", auth, async (req, res, next) => {
    const batteryId = req.params.batteryId;
    const stockId = Number(req.params.stockId);
    const battery = await Battery.findById(batteryId);

    // let btry = await Battery.find({
    //     'stock.stockId': stockId
    // }).then(data => {
    //     console.log('data =' + JSON.stringify(data))
    // })
    // return;
    // await Battery.update({
    //     'stock': {
    //         $elemMatch: {
    //             'stockId': stockId
    //         }
    //     }
    // }, {
    //     '$set': {
    //         'stock.$.totalSale': 9
    //     }
    // })
    await Battery.findOneAndUpdate(
        { _id: batteryId, "stock.stockId": stockId },
        {
            $inc: { 'stock.$.totalSale': 1 }
        }
    )
        // await Battery.findOneAndUpdate(
        //     { _id: batteryId, 'stock.stockId': stockId },
        //     { $inc: { 'stock.$.totalSale': 1 } })
        .then(data => {
            if (data) {
                res.status(200).json({ success: true, message: "Values Updated Successfully!" });
            } else {
                res.status(200).json({ success: false, message: "Values Not Updated!" });
            }
        });
});



// route to delete brand 
router.put("/delete/:id", auth, async (req, res, next) => {
    const update_Date = Date.now();
    await Battery.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted battery!' });
        } else {
            res.json({ success: true, message: 'battery deleted successfully!' });
        }
    })

})


module.exports = router;









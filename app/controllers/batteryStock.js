const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { batteryStock, validate } = require('../models/batteryStock');
const express = require('express');
const router = express.Router();
const stockUtility = require('../../middleware/battery');

// route to add new battery stock
router.post("/addnew", auth, async (req, res, next) => {
    const stock = new batteryStock(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await batteryStock.findOne({ techId: req.body.techId, stockId: req.body.stockId, batteryId: req.body.batteryId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Already assign please update stock' });
    stock.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all battery stock
router.get('/all', async (req, res) => {
    batteryStock.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all batteries by stock id
router.get('/byTechAssign', auth, async (req, res) => {
    let batteryId = req.query.batteryId;
    let techId = req.query.techId;
    let stockId = req.query.stockId;
    batteryStock.findOne({ batteryId: batteryId, techId: techId, stockId: stockId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get technician battery stock detail
router.get('/byTechBatteryDetaiL', auth, async (req, res) => {
    let batteryId = req.query.batteryId;
    let techId = req.query.techId;
    batteryStock.find({ batteryId: batteryId, techId: techId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all battery stock
router.get('/byBatteryIdTech', auth, async (req, res) => {
    let batteryId = req.query.batteryId;
    // let techId = req.query.techId;
    batteryStock.find({ batteryId: batteryId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get technician stocks
router.get("/techTotalAssign", auth, async (req, res, next) => {
    let techId = req.query.techId;
    // let todayStart = new Date();
    // todayStart.setHours(0, 0, 0, 0);
    // let todayEnd = new Date();
    // todayEnd.setHours(23, 59, 59);

    await batteryStock.aggregate([
        // First Stage match record
        {
            $match: { techId: techId }
        },
        //second stage group record and get sum
        {
            $group: {
                _id: "$batteryId",
                totalAssign: {
                    $sum: "$totalAssign",
                },
                totalSale: {
                    $sum: "$totalSale",
                },
                date: {
                    $push: "$updated_at",
                },
            }
        }])
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "No values Found!" });
            }
        });
});



// route to update battery stock 
router.put("/:id", auth, async (req, res, next) => {
    const stock = await batteryStock.findById(req.params.id);
    req.body.updated_at = Date.now()

    // let find = await batteryStock.findOne({ title: req.body.title, isDeleted: false, brandId: { $ne: req.body.brandId } });
    // if (find) return res.json({ success: false, message: 'Name already exists' });
    stock.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});


//get technician battery stock with assign job status
router.get('/byTechnicianAndJobsDetail/:id', auth, async (req, res) => {
    batteryStock.aggregate([
        { $match: { batteryId: req.params.id } },
        {
            $lookup: {
                from: 'jobassigns',
                as: 'jobs',
                let: { techId: '$techId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$techId', '$$techId'] },
                                    { $eq: ['$status', 'pending'] },
                                ]
                            }
                        }
                    }
                ]
            }
        },
    ])
        // const vehicleId = req.params.id;

        // // vehicles.aggregate([
        // //     {
        // //         "$lookup": {
        // //             "from": "carbrands",
        // //             "let": { "brandId": "$_id" },
        // //             "pipeline": [
        // //                 { "$addFields": { "brandId": { "$toObjectId": "$brandId" } } },
        // //                 { "$match": { "$expr": { "$eq": ["$brandId", "$$brandId"] } } }
        // //             ],
        // //             "as": "output"
        // //         }
        // //     }
        // // ])
        // vehicles.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(vehicleId)
        //         }
        //     },
        //     { "$addFields": { "testId": { "$toObjectId": "$brandId" } } },
        //     {
        //         $lookup:
        //         {
        //             from: 'carbrands',
        //             localField: 'testId',
        //             foreignField: '_id',
        //             as: 'detail'
        //         }
        //         // "detail": { "$arrayElemAt": [ "$countryInfo", 0 ] } 
        //     },
        //     {
        //         "$addFields": {
        //             "detail": {
        //                 "$arrayElemAt": ["$detail", 0]
        //             }
        //         }
        //     }

        // ])
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "not found" });
            }
        })
});


//get all battery stock
router.get('/getBatteryAvaialbeAssignStock/:id', async (req, res) => {
    let batteryId = req.params.id;
    // let techId = req.query.techId;
    // batteryStock.find({ batteryId: batteryId })
    batteryStock.aggregate([
        { $match: { batteryId: batteryId } },
        {
            "$addFields": {
                "isGrade1Greater": { "$cmp": ["$totalAssign", "$totalSale"] }
            }
        },
        { "$match": { "isGrade1Greater": 1 } }
    ])
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "not found" });
            }
        })
});


// // route to delete brand 
// router.put("/delete/:id", auth, async (req, res, next) => {
//     const update_Date = Date.now();
//     await batteryBrand.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
//         if (err) {
//             res.json({ success: false, message: 'Something wrong while deleted battery brand !' });
//         } else {
//             res.json({ success: true, message: 'brand deleted successfully!' });
//         }
//     })

// })


module.exports = router;









const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { tyre, validate } = require('../models/tyre');

const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// route to add new tyre
router.post("/addnew", auth, async (req, res, next) => {
    const tyr = new tyre(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await tyre.findOne({ title: req.body.title, companyId: req.body.companyId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    tyr.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!", data: result });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all tyres
router.get('/all', async (req, res) => {
    tyre.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});



//get tyre with company detail
router.get('/withCompanyData', async (req, res) => {
    // console.log('call hit');

    // return;
    tyre.aggregate([
        {
            $match: {
                isDeleted: false
            },

        },
        { $sort: { _id: -1 } },

        { "$addFields": { "testId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
                localField: 'testId',
                foreignField: '_id',
                as: 'company'
            }
        },

        {
            "$project": {
                "_id": 1,
                "title": 1,
                "imageUrl": 1,
                "company.title": 1
            }
        },
        {
            "$addFields": {
                "company": {
                    "$arrayElemAt": ["$company", 0]
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


//get tyre detail by tyre id
router.get('/:id', auth, async (req, res) => {
    tyre.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get tyre all detail 
router.get('/detail/:id/company', auth, async (req, res) => {
    const tyreId = req.params.id;
    tyre.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tyreId)
            }

        },
        { "$addFields": { "tyreCompanyId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
                localField: 'tyreCompanyId',
                foreignField: '_id',
                as: 'company'
            }
        },

        // {
        //     "$project": {
        //         "_id": 1,
        //         "title": 1,
        //         "imageUrl": 1,
        //         "company.title": 1
        //     }
        // },
        {
            "$addFields": {
                "company": {
                    "$arrayElemAt": ["$company", 0]
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



//get tyre with company detail
router.get('/detail/:id', auth, async (req, res) => {
    let tyreId = req.params.id;
    tyre.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tyreId)
            }
        },
        { "$addFields": { "testId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
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


//get multiple tyres with detail
router.get('/multiple/detail', async (req, res) => {
    let ids = req.query.ids;
    let allIds = JSON.parse(ids)
    tyre.find({ _id: { "$in": allIds } }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
})




// route to update tyre 
router.put("/:id", auth, async (req, res, next) => {
    const tyr = await tyre.findById(req.params.id);
    req.body.updated_at = Date.now()

    let find = await tyre.findOne({ title: req.body.title, isDeleted: false, tyreId: { $ne: req.body.tyreId } });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    tyr.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});


// route to update battery stock
router.put("/upateTyreStock/:tyreId/:stockId", auth, async (req, res, next) => {
    const tyreId = req.params.tyreId;
    const stockId = Number(req.params.stockId);
    // const battery = await Battery.findById(batteryId);

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
    await tyre.findOneAndUpdate(
        { _id: tyreId, "stock.stockId": stockId },
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

// route to delete company 
router.put("/delete/:id", auth, async (req, res, next) => {
    const update_Date = Date.now();
    await tyre.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted battery!' });
        } else {
            res.json({ success: true, message: 'battery deleted successfully!' });
        }
    })

})


module.exports = router;









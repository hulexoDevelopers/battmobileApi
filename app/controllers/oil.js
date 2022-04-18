const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { oil, validate } = require('../models/oil');

const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
// route to add new oil
router.post("/addnew", auth, async (req, res, next) => {
    const ol = new oil(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await oil.findOne({ title: req.body.title, companyId: req.body.companyId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    ol.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!", data: result });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all oils
router.get('/all', async (req, res) => {
    oil.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});



//get oil with company detail
router.get('/withCompanyData', async (req, res) => {
    // console.log('call hit');

    // return;
    oil.aggregate([
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


//get oil detail by oil id
router.get('/:id', auth, async (req, res) => {
    oil.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get oil all detail 
router.get('/detail/:id/company', auth, async (req, res) => {
    const oilId = req.params.id;
    oil.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(oilId)
            }

        },
        { "$addFields": { "oilCompanyId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
                localField: 'oilCompanyId',
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


//get oil with company detail
router.get('/detail/:id', auth, async (req, res) => {
    let oilId = req.params.id;
    oil.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(oilId)
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



//get multiple oils with detail
router.get('/multiple/detail', async (req, res) => {
    let ids = req.query.ids;
    let allIds = JSON.parse(ids)
    oil.find({ _id: { "$in": allIds } }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
})




// route to update oil 
router.put("/:id", auth, async (req, res, next) => {
    const tyr = await oil.findById(req.params.id);
    req.body.updated_at = Date.now()

    let find = await oil.findOne({ title: req.body.title, isDeleted: false, oilId: { $ne: req.body.oilId } });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    tyr.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});

// route to update oil stock
router.put("/upateOilStock/:oilId/:stockId", auth, async (req, res, next) => {
    const oilId = req.params.oilId;
    const stockId = Number(req.params.stockId);
   
    await oil.findOneAndUpdate(
        { _id: oilId, "stock.stockId": stockId },
        {
            $inc: { 'stock.$.totalSale': 1 }
        }
    )
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
    await oil.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted battery!' });
        } else {
            res.json({ success: true, message: 'battery deleted successfully!' });
        }
    })

})


module.exports = router;









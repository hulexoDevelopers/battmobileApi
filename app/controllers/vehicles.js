const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { vehicles, validate } = require('../models/vehicles');
const { Battery } = require('../models/battery');
const { tyre } = require('../models/tyre');
const { oil } = require('../models/oil');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
var mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
// route to add new vehicle
router.post("/addnew", auth, async (req, res, next) => {
    const vehicle = new vehicles(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await vehicles.findOne({ title: req.body.title, brandId: req.body.brandId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    vehicle.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});

//route get all vehicles
router.get('/all', async (req, res) => {
    vehicles.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get vehicle detail by vehicle id
router.get('/:id', auth, async (req, res) => {
    vehicles.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get vehicle with brand detail
router.get('/detail/:id', auth, async (req, res) => {
    const vehicleId = req.params.id;
    vehicles.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(vehicleId)
            }
        },
        { "$addFields": { "testId": { "$toObjectId": "$brandId" } } },
        {
            $lookup:
            {
                from: 'carbrands',
                localField: 'testId',
                foreignField: '_id',
                as: 'detail'
            }
            // "detail": { "$arrayElemAt": [ "$countryInfo", 0 ] } 
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


//get vehicle recomended batteries list
router.get('/recomendedBatteries/:vehicleId', auth, async (req, res) => {
    const vehicleId = req.params.vehicleId;
    let vehicle = await vehicles.findById(vehicleId);
    const recomendedIds = vehicle.batteries;
    if (!recomendedIds.length) {
        res.status(200).json({ success: true, data: [] });
    }
    let objIds = []
    for (let i = 0; i < recomendedIds.length; i++) {
        let id = mongodb.ObjectId(recomendedIds[i]);
        objIds.push(id);
    }
    Battery.aggregate([
        {
            $match: {
                isDeleted: false,
                _id: { "$in": objIds }
            },

        },
        { $sort: { _id: -1 } },

        { "$addFields": { "cId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'batterycompanies',
                localField: 'cId',
                foreignField: '_id',
                as: 'company'
            }
        },

        {
            "$project": {
                "_id": 1,
                "title": 1,
                "imageUrl": 1,
                "warranty":1,
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
    ]).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get vehicle recomended tyres list
router.get('/recomendedTyres/:vehicleId', auth, async (req, res) => {
    const vehicleId = req.params.vehicleId;
    let vehicle = await vehicles.findById(vehicleId);
    const recomendedIds = vehicle.tyres;
    if (!recomendedIds.length) {
        res.status(200).json({ success: true, data: [] });
    }
    let objIds = []
    for (let i = 0; i < recomendedIds.length; i++) {
        let id = mongodb.ObjectId(recomendedIds[i]);
        objIds.push(id);
    }
    tyre.aggregate([
        {
            $match: {
                isDeleted: false,
                _id: { "$in": objIds }
            },

        },
        { $sort: { _id: -1 } },

        { "$addFields": { "cId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
                localField: 'cId',
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
    ]).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});
//get vehicle recomended oils list
router.get('/recomendedOils/:vehicleId', auth, async (req, res) => {
    const vehicleId = req.params.vehicleId;
    let vehicle = await vehicles.findById(vehicleId);
    const recomendedIds = vehicle.oils;
    if (!recomendedIds.length) {
        res.status(200).json({ success: true, data: [] });
    }
    let objIds = []
    for (let i = 0; i < recomendedIds.length; i++) {
        let id = mongodb.ObjectId(recomendedIds[i]);
        objIds.push(id);
    }
    oil.aggregate([
        {
            $match: {
                isDeleted: false,
                _id: { "$in": objIds }
            },

        },
        { $sort: { _id: -1 } },

        { "$addFields": { "cId": { "$toObjectId": "$companyId" } } },
        {
            $lookup:
            {
                from: 'companies',
                localField: 'cId',
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
    ]).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});
// route to update vehicle 
router.put("/:id", auth, async (req, res, next) => {
    const vehicle = await vehicles.findById(req.params.id);
    req.body.updated_at = Date.now()
    vehicle.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});

// route to delete vehicle 
router.put("/delete/:id", auth, async (req, res, next) => {
    const update_Date = Date.now();
    await vehicles.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted vehicle !' });
        } else {
            res.json({ success: true, message: 'vehicle deleted successfully!' });
        }
    })

})
module.exports = router;









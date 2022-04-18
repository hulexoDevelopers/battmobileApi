const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { oilStock, validate } = require('../models/oilStock');
const express = require('express');
const router = express.Router();

// route to add new oil stock
router.post("/addnew", auth, async (req, res, next) => {
    const stock = new oilStock(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await oilStock.findOne({ techId: req.body.techId, stockId: req.body.stockId, oilId: req.body.oilId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Already assign please update stock' });
    stock.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all oil stock
router.get('/all', async (req, res) => {
    oilStock.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all oils by stock id
router.get('/byTechAssign', auth, async (req, res) => {
    let oilId = req.query.oilId;
    let techId = req.query.techId;
    let stockId = req.query.stockId;
    oilStock.findOne({ oilId: oilId, techId: techId, stockId: stockId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get technician oil stock detail
router.get('/byTechOilDetaiL', auth, async (req, res) => {
    let oilId = req.query.oilId;
    let techId = req.query.techId;
    console.log('oil' + oilId);
    console.log('texh' + techId)
    oilStock.find({ oilId: oilId, techId: techId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all oil stock
router.get('/byOilIdTech', auth, async (req, res) => {
    let oilId = req.query.oilId;
    console.log('oilid' + oilId)
    // let techId = req.query.techId;
    oilStock.find({ oilId: oilId }).then(result => {
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
    await oilStock.aggregate([
        // First Stage match record
        {
            $match: { techId: techId }
        },
        //second stage group record and get sum
        {
            $group: {
                _id: "$oilId",
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



// route to update oil stock 
router.put("/:id", auth, async (req, res, next) => {
    const stock = await oilStock.findById(req.params.id);
    req.body.updated_at = Date.now()
    stock.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});


//get technician oil stock with assign job status
router.get('/byTechnicianAndJobsDetail/:id', auth, async (req, res) => {
    oilStock.aggregate([
        { $match: { oilId: req.params.id } },
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
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "not found" });
            }
        })
});


//get all oil stock
router.get('/getOilAvaialbeAssignStock/:id', async (req, res) => {
    let oilId = req.params.id;
    oilStock.aggregate([
        { $match: { oilId: oilId } },
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




module.exports = router;









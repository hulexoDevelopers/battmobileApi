const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { tyreStock, validate } = require('../models/tyreStock');
const express = require('express');
const router = express.Router();

// route to add new tyre stock
router.post("/addnew", auth, async (req, res, next) => {
    const stock = new tyreStock(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await tyreStock.findOne({ techId: req.body.techId, stockId: req.body.stockId, tyreId: req.body.tyreId, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Already assign please update stock' });
    stock.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//route get all tyre stock
router.get('/all', async (req, res) => {
    tyreStock.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all tyres by stock id
router.get('/byTechAssign', auth, async (req, res) => {
    let tyreId = req.query.tyreId;
    let techId = req.query.techId;
    let stockId = req.query.stockId;
    tyreStock.findOne({ tyreId: tyreId, techId: techId, stockId: stockId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get technician tyre stock detail
router.get('/byTechTyreDetaiL', auth, async (req, res) => {
    let tyreId = req.query.tyreId;
    let techId = req.query.techId;
    tyreStock.find({ tyreId: tyreId, techId: techId }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get all tyre stock
router.get('/byTyreIdTech', auth, async (req, res) => {
    let tyreId = req.query.tyreId;
    // let techId = req.query.techId;
    tyreStock.find({ tyreId: tyreId }).then(result => {
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
    await tyreStock.aggregate([
        // First Stage match record
        {
            $match: { techId: techId }
        },
        //second stage group record and get sum
        {
            $group: {
                _id: "$tyreId",
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



// route to update tyre stock 
router.put("/:id", auth, async (req, res, next) => {
    const stock = await tyreStock.findById(req.params.id);
    req.body.updated_at = Date.now()
    stock.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});


//get technician tyre stock with assign job status
router.get('/byTechnicianAndJobsDetail/:id', auth, async (req, res) => {
    tyreStock.aggregate([
        { $match: { tyreId: req.params.id } },
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


//get all tyre stock
router.get('/getTyreAvaialbeAssignStock/:id', async (req, res) => {
    let tyreId = req.params.id;
    tyreStock.aggregate([
        { $match: { tyreId: tyreId } },
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









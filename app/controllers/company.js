const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { company, validate } = require('../models/company');
const express = require('express');
const router = express.Router();

// route to add new company
router.post("/addnew", auth, async (req, res, next) => {
    const cmpny = new company(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await company.findOne({ title: req.body.title, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    cmpny.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});

//route get all companies
router.get('/all', async (req, res) => {
    company.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get company detail
router.get('/:id', async (req, res) => {
    company.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


// route to update company 
router.put("/:id", auth, async (req, res, next) => {
    const cmpny = await company.findById(req.params.id);
    req.body.updated_at = Date.now()

    let find = await company.findOne({ title: req.body.title, isDeleted: false, companyId: { $ne: req.body.brandId } });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    cmpny.updateOne(req.body).then(data => {
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
    await company.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted company!' });
        } else {
            res.json({ success: true, message: 'company deleted successfully!' });
        }
    })

})


module.exports = router;









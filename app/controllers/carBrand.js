const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { carBrand, validate } = require('../models/carBrand');
const express = require('express');
const router = express.Router();

// route to add new car brand
router.post("/addnew", auth, async (req, res, next) => {
    const brand = new carBrand(req.body);
    const { error } = validate(req.body);
    if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
    let find = await carBrand.findOne({ title: req.body.title, isDeleted: false });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    brand.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});

//route get all car brands
router.get('/all', async (req, res) => {
    carBrand.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get brand detail by brand id
router.get('/:id', auth, async (req, res) => {
    carBrand.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


// route to update brand 
router.put("/:id", auth, async (req, res, next) => {
    const brand = await carBrand.findById(req.params.id);
    req.body.updated_at = Date.now()

    let find = await carBrand.findOne({ title: req.body.title, isDeleted: false, brandId: { $ne: req.body.brandId } });
    if (find) return res.json({ success: false, message: 'Name already exists' });
    brand.updateOne(req.body).then(data => {
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
    await carBrand.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted car brand !' });
        } else {
            res.json({ success: true, message: 'brand deleted successfully!' });
        }
    })

})


module.exports = router;









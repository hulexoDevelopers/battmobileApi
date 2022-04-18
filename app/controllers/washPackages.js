const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { Package, validate } = require('../models/washPackages');

const express = require('express');
const router = express.Router();

// route to add new package list
router.post("/addnew", auth, async (req, res, next) => {
    const pkg = new Package(req.body);
    pkg.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(404).json({ success: false, message: "values Not saved!" });
        }
    });
});

// route get all packages
router.get('/all', auth, async (req, res) => {
    Package.find().then(price => {
        if (price) {
            res.status(200).json(price);
        } else {
            res.status(404).json({ message: "package not found" });
        }
    })

});


// route to update package
router.put("/:id", auth, async (req, res, next) => {
    const pkg = await Package.findById(req.params.id);
    req.body.updated_at = Date.now()
    pkg.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});

module.exports = router;









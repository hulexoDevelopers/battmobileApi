const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { location, validate } = require('../models/locations');
const express = require('express');
const router = express.Router();

// route to add new battery brand
router.post("/addnew", auth, async (req, res, next) => {
    const loc = new location(req.body);
    loc.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});


//get user locations
router.get('/byUserId/:id', auth, async (req, res) => {
    location.find({ userId: req.params.id }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});




router.put("/updateLocation/:id", auth, async (req, res, next) => {
    const update_Date = Date.now();

    await location.updateOne({ _id: req.params.id }, { $set: { 'type': req.body.type, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong!' });
        } else {
            res.json({ success: true, message: 'Location updated successfully!' });
        }
    })

})


module.exports = router;









const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { notification, validate } = require('../models/notification');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

// route to add new notification
router.post("/addnew", auth, async (req, res, next) => {
    const notif = new notification(req.body);
    notif.save().then(result => {
        if (result) {
            res.status(200).json({ success: true, message: "New values Saved successful!" });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});

//route get all notification
router.get('/all', async (req, res) => {
    notification.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});




module.exports = router;









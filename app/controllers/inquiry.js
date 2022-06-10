const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const { inquiry } = require('../models/inquiry');
const express = require('express');
const smsManager = require('../../middleware/sms');
const router = express.Router();

// route to add new inquiry
router.post("/addnew", auth, async (req, res, next) => {

    inquiry.find().sort({ _id: -1 }).limit(5).then((data) => {
        if (data.length && data[0].inquiryId) {
            req.body.inquiryId = data[0].inquiryId + 1
        } else {
            req.body.inquiryId = 1000;
        }
        const inq = new inquiry(req.body);
        inq.save().then(result => {
            if (result) {
                smsManager.newInquirySms(result.contactNo)
                res.status(200).json({ success: true, message: "New values Saved successful!" });
            } else {
                res.status(200).json({ success: false, message: "values Not saved!" });
            }
        });
        // }

        // const { error } = validate(req.body);
        // if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
        // let find = await vehicles.findOne({ title: req.body.title, brandId: req.body.brandId, isDeleted: false });
        // if (find) return res.json({ success: false, message: 'Name already exists' });

    });
});

//route get all inquiries
router.get('/all', async (req, res) => {
    inquiry.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


//get all customer inquiries
router.get('/byCustomerId/:id', async (req, res) => {
    inquiry.find({ isDeleted: false, customerId: req.params.id }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

router.get('/byDate', async (req, res) => {
    let startDate = new Date(req.query.date);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(req.query.date);
    endDate.setHours(23, 59, 59);
    await inquiry.find({ created_at: { $gt: startDate, $lt: endDate } })
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "not found" });
            }
        })
})

//get inquiry detail by inquiry id
router.get('/:id', async (req, res) => {
    inquiry.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});


// route to update inquiry
router.put("/:id", auth, async (req, res, next) => {
    const inq = await inquiry.findById(req.params.id);
    req.body.updated_at = Date.now()
    inq.updateOne(req.body).then(data => {
        if (data) {
            res.status(200).json({ success: true, message: "Values Updated Successfully!" });
        } else {
            res.status(200).json({ success: false, message: "Values Not Updated!" });
        }
    });
});

// route to delete inquiry 
router.put("/delete/:id", auth, async (req, res, next) => {
    const update_Date = Date.now();
    await inquiry.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted vehicle !' });
        } else {
            res.json({ success: true, message: 'vehicle deleted successfully!' });
        }
    })

})


module.exports = router;









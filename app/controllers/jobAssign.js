const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const stats = require('./../../middleware/techStats');
const { jobAssign } = require('../models/jobAssign');
const { inquiry } = require('../models/inquiry');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const smsManager = require('../../middleware/sms');
// route to add new job 
router.post("/addnew", auth, async (req, res, next) => {
    const job = new jobAssign(req.body);
    job.save().then(result => {
        if (result) {
            let user = User.findById(result.techId);
            if (user && user.contact) {
                smsManager.newJobAssign(user.contact)
            }

            res.status(200).json({ success: true, message: "New values Saved successful!", data: result._id });
        } else {
            res.status(200).json({ success: false, message: "values Not saved!" });
        }
    });
});

//route get all inquiries
router.get('/all', async (req, res) => {
    jobAssign.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get inquiry detail by inquiry id
router.get('/:id', auth, async (req, res) => {
    jobAssign.findById(req.params.id).then(result => {
        if (result) {
            res.status(200).json({ success: true, data: result });
        } else {
            res.status(200).json({ success: false, message: "not found" });
        }
    })
});

//get technician assign jobs
router.get('/bytechId/:id', auth, async (req, res) => {
    const techId = req.params.id;
    jobAssign.aggregate([
        { $match: { techId: techId } },
        {
            $lookup:
            {
                from: 'inquiries',
                localField: 'inquiryDetailId',
                foreignField: '_id',
                as: 'detail'
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

router.put("/busiestTech", auth, async (req, res, next) => {
    // console.log('call hit');
    const allTechnicians = await User.find({ isDeleted: false, role: "technician" });
    const techStock = await stats.getTechJobStats(allTechnicians)
        .then(result => {
            if (result) {
                res.status(200).json({ success: true, data: result });
            } else {
                res.status(200).json({ success: false, message: "Values Not Updated!" });
            }
        });
});


router.get('/getJobWithDetail/:id', auth, async (req, res) => {
    const jobId = req.params.id;
    jobAssign.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(jobId)
            }
        },
        {
            $lookup:
            {
                from: 'inquiries',
                localField: 'inquiryDetailId',
                foreignField: '_id',
                as: 'detail'
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

//get assign job with technician detail
router.get('/getInquiryJobsWithTechnician/:id', async (req, res) => {
    const inquiryId = req.params.id;
    jobAssign.aggregate([
        {
            $match: {
                inquiryId: inquiryId
            }
        },
        { "$addFields": { "technicianId": { "$toObjectId": "$techId" } } },
        {
            $lookup:
            {
                from: 'users',
                localField: 'technicianId',
                foreignField: '_id',
                as: 'technician'
            }
        },
        {
            "$addFields": {
                "technician": {
                    "$arrayElemAt": ["$technician", 0]
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







//get assign job with technician detail
// router.get('/getInquiryActiveJobsWithTechnician/:id', async (req, res) => {
//     const inquiryId = req.params.id;
//     jobAssign.aggregate([
//         {
//             $match: {
//                 inquiryId: inquiryId, status: 'pending'
//             }
//         },
//         { "$addFields": { "technicianId": { "$toObjectId": "$techId" } } },
//         {
//             $lookup:
//             {
//                 from: 'users',
//                 localField: 'technicianId',
//                 foreignField: '_id',
//                 as: 'technician'
//             }
//         },
//         {
//             "$addFields": {
//                 "technician": {
//                     "$arrayElemAt": ["$technician", 0]
//                 }
//             }
//         }

//     ])
//         .then(result => {
//             if (result) {
//                 res.status(200).json({ success: true, data: result });
//             } else {
//                 res.status(200).json({ success: false, message: "not found" });
//             }
//         })
// });


// route to update inquiry
router.put("/:id", auth, async (req, res, next) => {
    const job = await jobAssign.findById(req.params.id);
    req.body.updated_at = Date.now()
    job.updateOne(req.body).then(data => {
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
    await jobAssign.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
        if (err) {
            res.json({ success: false, message: 'Something wrong while deleted vehicle !' });
        } else {
            res.json({ success: true, message: 'vehicle deleted successfully!' });
        }
    })

})


module.exports = router;









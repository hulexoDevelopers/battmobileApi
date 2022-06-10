const _ = require('lodash');
require('dotenv').config();
const mail = require('../../middleware/emailManager');
const emailManager = require('../../middleware/email');
const { User, validate } = require('../models/user');
const { vehicles } = require('../models/vehicles');
const Encrypt = require('../../middleware/Encrypt&Decrypt');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();
const ut = require('../../middleware/util');
var replaceall = require("replaceall");
const emailMid = require('../../middleware/emailmid');
const validateTok = require('../../middleware/validate');
var mongodb = require('mongodb');
// route to save new user
router.post("/register", async (req, res, next) => {
  const user = new User(req.body);
  // const { error } = validate(req.body);
  // if (error) return res.json({ success: false, message: (error)});
  // let usr = await User.findOne({ email: req.body.email });
  // if (usr) return res.json({ success: false, message: 'Email already register' });
  let usrContact = await User.findOne({ contact: req.body.contact });
  if (usrContact) return res.json({ success: false, message: 'Contact already register' });
  user.save().then(result => {
    if (result) {
      res.status(200).json({ success: true, message: "Account created!", data: result });
    } else {
      res.status(200).json({ success: false, message: "Error please try again!" });
    }
  });
});


// route to save new company
router.post("/save", auth, async (req, res, next) => {
  const user = new User(req.body);
  const { error } = validate(req.body);
  if (error) return res.json({ success: false, message: 'Validation error', error: (error) });
  let usr = await User.findOne({ email: req.body.email });
  if (usr) return res.json({ success: false, message: 'Email already register' });
  user.save().then(result => {
    if (result) {
      res.status(200).json({ success: true, message: "Account created!", data: result });
    } else {
      res.status(200).json({ success: false, message: "Error please try again!" });
    }
  });
});


// user login verification
router.post('/login', async (req, res) => {
  let email = req.body.email.replace(/\s/g, '');
  email = email.toLowerCase();
  let user = await User.findOne({ email: email });
  if (!user) {
    user = await User.findOne({ contact: email });
  }
  if (!user) return res.json({ success: false, message: 'Invalid User.' });
  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) return res.json({ success: false, message: 'Invalid password.' });
  // if (user.isActive == false ) return res.json({ success: false, message: 'User Is Not Active'});
  if (user.isDeleted == true) return res.json({ success: false, message: 'your account is blocked please contact with admin' });
  if (user.role == 'customer' && user.otpVerified == false) return res.json({ success: false, message: 'Please verify your contact no' });
  // generate token for user
  const token = user.generateAuthToken();
  // update the user last login date
  await user.updateOne(
    {
      $set: {
        "lastLoginDate": Date.now(),
      }, function(error) {
        return error
      }
    });
  // response to the front end
  res.status(200).json({
    success: true,
    token: token
  });
});


//send forget password email
router.post('/forgetPassword', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, message: 'Email not found' });

  const token = user.generateForgetLink();
  let url = `${process.env.forget_url}token=${token}`;
  const text = `</b>A password change request for your account ${user.email} was requested.Click on the following link to 
  confirm your request and create a new password.
  Please note that this link will expire after 2 hours from the time it was sent. If you did not request 
  a password reset then please ignore this message.
    `


  try {
    // emailMid.sendEmail()
    let html = await ut.readTemplate(`forgetPassword`);

    html = replaceall(`{{link}}`, url, html);
    html = replaceall(`{{message}}`, text, html);
    let data = {
      from: 'Wajabat <admin@arpinax.com>',
      to: user.email,
      subject: 'Password Reset Email',
      html: html
    }

    emailMid.sendEmail(data)
      // emailManager.sendEmail({
      //   from:'admin@arpinax.com',
      //   to: user.email,
      //   subject: 'Password Reset Email',
      //   html: html
      // })
      .then(data => {
        return res.status(200).send({ success: true, message: 'Email sent' });
      })


  } catch (ex) {
    return res.status(500).send(ex.message);
  }

});
// reset  password

router.post('/validateToken', async (req, res) => {
  let token = req.body.token;
  validateTok.validateToken(token).then(data => {
    if (data.isValid == true) {
      res.json({ success: true, data: data });
    } else {
      res.json({ success: false, data: data });
    }
  })
});


router.post('/resetPassword', auth, async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) return res.json({ success: false, message: 'User not found' });
  // const validPassword = bcrypt.compareSync(req.body.password, user.password);
  // if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  var newPassword = req.body.newPassword
  newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        password: newPassword,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Password is reset successfully!' });
});


router.post('/customerResetPassword', async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) return res.json({ success: false, message: 'User not found' });
  // const validPassword = bcrypt.compareSync(req.body.password, user.password);
  // if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  var newPassword = req.body.newPassword
  newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        password: newPassword,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Password is reset successfully!' });
});
//change password
router.post('/changePassword', auth, async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) return res.json({ success: false, message: 'User not found' });
  const validPassword = bcrypt.compareSync(req.body.password, user.password);
  if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  var newPassword = req.body.newPassword
  newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        password: newPassword,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Password is reset successfully!' });
});



//update technician password
router.post('/changeTechnicianPassword', auth, async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) return res.json({ success: false, message: 'User not found' });
  // const validPassword = bcrypt.compareSync(req.body.password, user.password);
  // if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  var newPassword = req.body.newPassword
  newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        password: newPassword,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Password is reset successfully!' });
});

router.post('/userToken', async (req, res) => {
  console.log('call hit' + JSON.stringify(req.body))
  let token = req.body.token;
  let contact = req.body.contact;
  const user = await User.findOne({ contact: contact });
  if (!user) return res.json({ success: false, message: 'Contact not found' });
  // const validPassword = bcrypt.compareSync(req.body.password, user.password);
  // if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  // var newPassword = req.body.newPassword
  // newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        otpToken: token,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Token updated!' });
});

//update password
router.post('/updatePassword', async (req, res) => {
  let password = req.body.password;
  let token = req.body.token;
  let contact = req.body.contact;
  const user = await User.findOne({ contact: contact, otpToken: token })
  if (!user) return res.json({ success: false, message: 'User not found' });
  // const validPassword = bcrypt.compareSync(req.body.password, user.password);
  // if (!validPassword) return res.json({ success: false, message: 'Invalid previous password.' });
  var newPassword = password
  newPassword = bcrypt.hashSync(newPassword, saltRounds);
  await user.updateOne(
    {
      $set:
      {
        password: newPassword,
        updated_at: Date.now(),
      }
    }
  )
  res.json({ success: true, message: 'Password is reset successfully!' });
});
//get user by id
router.get('/byId/:id', auth, async (req, res) => {
  User.findOne({ _id: req.params.id }).then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })

});


//get all technician list
router.get('/technicians', auth, async (req, res) => {
  User.find({ role: 'technician', isDeleted: false }).then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })

});


//find user by contact
router.get('/byContact', auth, async (req, res) => {
  let contactNo = req.query.contactNo;
  User.findOne({ contact: contactNo }).then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })

});


router.get('/allUsers', auth, async (req, res) => {
  User.findOne().then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })

});

//update user by id
router.put("/update/:id", auth, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  req.body.updated_at = Date.now()
  user.updateOne(req.body).then(data => {
    if (data) {
      res.status(200).json({ success: true, message: "Updated Successfully!" });
    } else {
      res.status(200).json({ success: false, message: "Values Not Updated!" });
    }
  });
});


//update user by id
router.put("/updateLocation/:id", auth, async (req, res, next) => {
  const user = await User.findById(req.params.id);
  req.body.updated_at = Date.now()
  delete req.body.activeStatus;
  user.updateOne(req.body).then(data => {
    if (data) {
      res.status(200).json({ success: true, message: "Updated Successfully!" });
    } else {
      res.status(200).json({ success: false, message: "Values Not Updated!" });
    }
  });
});

//get all users 
router.get('/all', auth, async (req, res) => {
  User.find({ isDeleted: false }).sort({ _id: -1 }).then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })
});


//get all users meta data 
router.get('/metaData', async (req, res) => {
  let userProjection = {
    password: false,
    lastLoginDate: false,
    isDeleted: false,
    isActive: false,
    created_at: false,
    updated_at: false
  }
  User.find({ isDeleted: false }, userProjection).then(result => {
    if (result) {
      res.status(200).json({ success: true, data: result });
    } else {
      res.status(200).json({ success: false, message: "not found" });
    }
  })

});


// route to delete brand 
router.put("/delete/:id", auth, async (req, res, next) => {
  const update_Date = Date.now();
  await User.updateOne({ _id: req.params.id }, { $set: { 'isDeleted': true, 'updated_at': update_Date } }, function (err) {
    if (err) {
      res.json({ success: false, message: 'Something wrong while deleted user !' });
    } else {
      res.json({ success: true, message: 'User deleted successfully!' });
    }
  })

})


//route to update technician active status
router.put("/updateActiveStatus/:id", auth, async (req, res, next) => {
  const update_Date = Date.now();
  await User.updateOne({ _id: req.params.id }, { $set: { 'activeStatus': req.body.status, 'updated_at': update_Date } }, function (err) {
    if (err) {
      res.json({ success: false, message: 'Something wrong!' });
    } else {
      res.json({ success: true, message: 'Status update!' });
    }
  })

})



//get all technician with active jobs
router.get('/techniciansWithActiveJobs', async (req, res) => {
  // const userId = req.userData.userId;
  // const limit = parseInt(req.params.limit);
  // const page = parseInt(req.params.page);

  // User.aggregate([
  //   { "$match": { "role": "technician" } },
  //   { "$addFields": { "technicianId": { "$toString": "$_id" } } },
  //   { $sort: { count: -1 } },
  //   // { $skip: limit * page },
  //   // { $limit: limit },
  //   {
  //     $lookup: {
  //       from: "jobassigns",
  //       let: { keywordId: "$_id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$techId", "$$technicianId"] },
  //                 // {
  //                 //   $eq: ["$techId", mongoose.Types.ObjectId(userId)],
  //                 // },
  //               ],
  //             },
  //           },
  //         },
  //       ],
  //       as: "keywordData",
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       id: "$_id",
  //       count: 1,
  //       for: 1,
  //       against: 1,
  //       created_at: 1,
  //       updated_at: 1,
  //       keyword: 1,
  //       selected: {
  //         $cond: {
  //           if: {
  //             $eq: [{ $size: "$keywordData" }, 0],
  //           },
  //           then: false,
  //           else: true,
  //         },
  //       },
  //     },
  //   }])
  // User.aggregate([
  //   { "$match": { "role": "technician" } },
  //   { "$addFields": { "technicianId": { "$toString": "$_id" } } },
  //   {
  //     "$lookup": {
  //       "from": 'jobassigns',
  //       "localField": 'technicianId',
  //       "foreignField": 'techId',
  //       "as": 'Jobs'
  //     }
  //   },
  //   {
  //     "$addFields": {
  //       "Jobs": {
  //         "$arrayElemAt": [
  //           {
  //             "$filter": {
  //               "input": "$Jobs",
  //               "as": "job",
  //               "cond": {
  //                 "$eq": ["$$job.status", "pending"]
  //               }
  //             }
  //           }, 0
  //         ]
  //       }
  //     }
  //   }
  // ])

  // User.aggregate([
  //   { "$match": { "role": "technician" } },
  //   { "$addFields": { "technicianId": { "$toString": "$_id" } } },
  //   {
  //     $lookup:
  //     {
  //       from: "jobassigns",
  //       localField: "technicianId",
  //       foreignField: "techId",
  //       let: { "jobassigns.techId": "technicianId" },
  //       // pipeline: [{ $match: { "shopPosId": { "$exists": false } } }],
  //       as: "shopDescr"
  //     }
  //   }]
  // )
  // User.aggregate([
  //   { "$match": { "role": "technician" } },
  //   { "$addFields": { "technicianId": { "$toString": "$_id" } } },
  //   {
  //     "$lookup": {
  //       "from": "jobassigns",
  //       "let": { "id": "$techId" },
  //       "pipeline": [
  //         {
  //           "$match": {
  //             "status": "pending",
  //             "techId": "$$technicianId",
  //             // "$expr": { "$in": ["$$id", "$contain"] }
  //           }
  //         }
  //       ],
  //       "as": "childs"
  //     }
  //   }
  // ])

  User.aggregate([
    { "$match": { "role": "technician", activeStatus: true } },
    { "$addFields": { "technicianId": { "$toString": "$_id" } } },
    {
      $lookup:
      {
        from: "jobassigns",
        localField: "technicianId",
        foreignField: "techId",
        as: "jobs"
      }
    },
    {
      $project:
      {
        email: 1,
        firstName: 1,
        lastName: 1,
        data: 1,
        jobs:
        {
          $filter:
          {
            input: "$jobs",
            as: "job",
            // qtyEq: { $eq: [ "$qty", 250 ] },
            cond: {
              "$and": [{ "$eq": ["$$job.status", "pending"] }
                // , { "$eq" : [ "$$line.item.id" , "BAT10001"]}
              ]
            }
            // cond: { $eq: ["$$pet.status", "pending"] }
          }
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



router.get('/contactEmail', async (req, res) => {
  console.log('sending email');

  emailManager.sendEmail()
    // emailManager.sendEmail({
    //   from: 'admin@arpinax.com',
    //   to: user.email,
    //   subject: 'Password Reset Email',
    //   html: html
    // })
    .then(data => {
      return res.status(200).send({ success: true, message: 'Email sent' });
    })

});

router.get('/vehicles/:userId', auth, async (req, res) => {

  const userId = req.params.userId;
  let user = await User.findById(userId);
  const userVehicles = user.vehicles;
  if (!userVehicles.length) {
    res.status(200).json({ success: true, data: [] });
    return
  }

  let objIds = []
  for (let i = 0; i < userVehicles.length; i++) {
    let id = mongodb.ObjectId(userVehicles[i].vehicleId);
    objIds.push(id);
  }
  vehicles.aggregate([
    {
      $match: {
        isDeleted: false,
        _id: { "$in": objIds }
      },

    },
    { $sort: { _id: -1 } },

    { "$addFields": { "cId": { "$toObjectId": "$brandId" } } },
    {
      $lookup:
      {
        from: 'carbrands',
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


module.exports = router;

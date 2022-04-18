const Joi = require('joi');
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    type: {
        type: String,
    },
    detail: {
        type: String,
    },
    for:{
        type:String
    },
    detail:{
        type:Object
    },
    
    isDeleted: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }


});

const notification = mongoose.model('notification', notificationSchema);
// function validateVehicle(vehicles) {
//     const schema = {
//         userId: Joi.string().min(1).max(300).required(),
//         brandId: Joi.string().min(1).max(300).required(),
//         title: Joi.string().min(1).max(100).required(),
//         batteries: Joi.optional().allow(''),
//         imageUrl: Joi.string().optional().allow(''),

//     };

//     return Joi.validate(vehicles, schema);
// }

exports.notificationSchema = notificationSchema;
exports.notification = notification;
// exports.validate = validateVehicle;




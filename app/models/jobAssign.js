const Joi = require('joi');
const mongoose = require('mongoose');

const jobAssignSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    agentName: {
        type: String,
    },
    inquiryId: {
        type: String,
    },
    techId: {
        type: String,
    },
    inquiryDetailId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    remarks: {
        type: String,
        default: ''
    },
    paymentType: {
        type: String,
        default: ''
    },
    paymentDetail: {
        type: Object,
    },
    paymentCard:{
        type: String,
        default:''
    },
    payment: {
        type: Number,
        default: 0
    },
    serviceDetail: {
        type: Object
    },
    serviceType: {
        type: String,
        default: ''
    },
    isScrape: {
        type: Boolean,
        default: false
    },
    scrapeDetail: {
        type: Object,
        default:{}
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

const jobAssign = mongoose.model('jobAssign', jobAssignSchema);
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

exports.jobAssignSchema = jobAssignSchema;
exports.jobAssign = jobAssign;
// exports.validate = validateVehicle;




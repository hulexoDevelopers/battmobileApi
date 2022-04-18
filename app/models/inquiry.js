const Joi = require('joi');
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    agentName: {
        type: String,
    },
    inquiryId: {
        type: Number,
    },
    contactNo: {
        type: String,
    },
    customerId: {
        type: String,
    },
    personalInfo: {
        type: Object,
    },
    address: {
        type: Array,
        default: []
    },
    serviceType: {
        type: String,
    },
    serviceDetail: {
        type: Array,
        default: []
    },
    vehicleDetail: {
        type: Array,
        default: []
    },
    inquiryFrom: {
        type: String,
    },
    inquiryStatus: {
        type: String,
    },
    orderStatus: {
        type: String,
        default: 'pending',
    },
    inquiryNote: {
        type: String,
        default: ''
    },
    remarks: {
        type: String,
        default: ''

    },
    inquiryDetail: {
        type: String,
        default: ''

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

const inquiry = mongoose.model('inquiry', inquirySchema);
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

exports.inquirySchema = inquirySchema;
exports.inquiry = inquiry;
// exports.validate = validateVehicle;




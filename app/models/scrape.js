const Joi = require('joi');
const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    inquiryId: {
        type: String,
    },
    techId: {
        type: String
    },
    title: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number
    },
    imageUrl: {
        type: String,
        default: '--'
    },
    detail: {
        type: String
    },
    stock: {
        type: Array,
        default: []
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

const battery = mongoose.model('battery', batterySchema);
function validateBattery(battery) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        brandId: Joi.string().min(1).max(300).required(),
        title: Joi.string().min(1).max(100).required(),
        imageUrl: Joi.string().optional().allow(''),

    };

    return Joi.validate(battery, schema);
}

exports.batterySchema = batterySchema;
exports.Battery = battery;
exports.validate = validateBattery;




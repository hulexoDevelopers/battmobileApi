const Joi = require('joi');
const mongoose = require('mongoose');

const oilSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    oilId: {
        type: String,
    },
    companyId: {
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

const oil = mongoose.model('oil', oilSchema);
function validateOil(oil) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        companyId: Joi.string().min(1).max(300).required(),
        oilId: Joi.string().min(1).max(300).required(),
        title: Joi.string().min(1).max(100).required(),
        quantity: Joi.number().min(1).required(),
        price: Joi.number().min(1).required(),
        detail: Joi.string().min(1).max(1500).required(),
        imageUrl: Joi.string().optional().allow(''),
        stock: Joi.allow('').optional()

    };

    return Joi.validate(oil, schema);
}

exports.oilSchema = oilSchema;
exports.oil = oil;
exports.validate = validateOil;




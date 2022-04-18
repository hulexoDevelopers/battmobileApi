const Joi = require('joi');
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    brandId: {
        type: String,
    },
    title: {
        type: String,
    },
    imageUrl: {
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

const carBrand = mongoose.model('carBrand', brandSchema);
function validateBrand(carBrand) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        brandId: Joi.string().min(1).max(300).required(),
        title: Joi.string().min(1).max(100).required(),
        imageUrl: Joi.string().optional().allow(''),

    };

    return Joi.validate(carBrand, schema);
}

exports.brandSchema = brandSchema;
exports.carBrand = carBrand;
exports.validate = validateBrand;




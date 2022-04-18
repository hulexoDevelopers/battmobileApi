const Joi = require('joi');
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    companyId: {
        type: String,
    },
    title: {
        type: String,
    },
    imageUrl: {
        type: String,
        default: ''
    },
    type: {
        type: String,
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

const company = mongoose.model('company', companySchema);
function validateCompany(company) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        companyId: Joi.string().min(1).max(300).required(),
        title: Joi.string().min(1).max(100).required(),
        type: Joi.string().min(1).max(100).required(),
        imageUrl: Joi.string().optional().allow(''),

    };

    return Joi.validate(company, schema);
}

exports.companySchema = companySchema;
exports.company = company;
exports.validate = validateCompany;
const Joi = require('joi');
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    userId: {
        type: String,
        minlength: 0,
        maxlength: 500
    },
    name: {
        type: String,
        default: 'Main'
    },
    packages: {
        type: Array,
        default: []
    },
    packageList: {
        type: Array,
        default: []
    },
    bronzePrice: {
        type: Number,
    },
    silverPrice: {
        type: Number
    },
    goldPrice: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }



});

const package = mongoose.model('package', packageSchema);

function validatePackage(Package) {
    const schema = {
        userId: Joi.string().min(0).max(500).allow(''),
        name: Joi.string(),
        packages: Joi.allow(''),
        packageList: Joi.allow(''),
        bronzePrice: Joi.require(),
        silverPrice: Joi.require(),
        goldPrice: Joi.require()
    };

    return Joi.validate(Package, schema);
}

exports.packageSchema = packageSchema;
exports.Package = package;
exports.validate = validatePackage;








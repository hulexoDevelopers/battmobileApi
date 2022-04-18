const Joi = require('joi');
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    location: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: 'home',
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

const location = mongoose.model('location', locationSchema);
function validateLocation(location) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        location: Joi.optional(),
        type: Joi.string()

    };

    return Joi.validate(location, schema);
}

exports.locationSchema = locationSchema;
exports.location = location;
exports.validate = validateLocation;




const Joi = require('joi');
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    brandId: {
        type: String,
        
    },
    title: {
        type: String,
    },
    batteries: {
        type: Array,
        default: []
    },
    oils: {
        type: Array,
        default: []
    },
    tyres: {
        type: Array,
        default: []
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

const vehicles = mongoose.model('vehicle', vehicleSchema);
function validateVehicle(vehicles) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        brandId: Joi.string().min(1).max(300).required(),
        title: Joi.string().min(1).max(100).required(),
        batteries: Joi.optional().allow(''),
        oils: Joi.optional().allow(''),
        tyres: Joi.optional().allow(''),
        imageUrl: Joi.string().optional().allow(''),

    };

    return Joi.validate(vehicles, schema);
}

exports.vehicleSchema = vehicleSchema;
exports.vehicles = vehicles;
exports.validate = validateVehicle;




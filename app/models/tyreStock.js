const Joi = require('joi');
const mongoose = require('mongoose');

const tyreStockSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    tyreId: {
        type: String,
    },
    stockId: {
        type: String,
    },
    companyId: {
        type: String
    },
    techId: {
        type: String
    },
    price: {
        type: Number
    },
    totalAssign: {
        type: Number,
        default: 0
    },
    totalSale: {
        type: Number,
        default: 0
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
        type: Date,
        default: Date.now
    }


});

const tyreStock = mongoose.model('tyreStock', tyreStockSchema);
function validateTyreStock(tyreStock) {
    const schema = {
        userId: Joi.string().min(1).max(300).required(),
        tyreId: Joi.string().min(1).max(300).required(),
        companyId: Joi.string().min(1).max(100).required(),
        stockId: Joi.number().required(),
        techId: Joi.string().min(1).max(100).required(),
        price: Joi.number().required(),
        totalAssign: Joi.number().optional().allow(''),
        totalSale:Joi.number().optional().allow(''),

    };

    return Joi.validate(tyreStock, schema);
}

exports.tyreStockSchema = tyreStockSchema;
exports.tyreStock = tyreStock;
exports.validate = validateTyreStock;




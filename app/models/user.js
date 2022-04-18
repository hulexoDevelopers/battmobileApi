require('dotenv').config();
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    userId: {
        type: String,

    },
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: 'customer'
    },
    contact: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    data: {
        type: Array,
        default: []
    },
    vehicles: {
        type: Array,
        default: []
    },
    imageUrl: {
        type: String,
        default: ''
    },
    lastLoginDate: {
        type: Date,
        default: ''
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    otpToken: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = Jwt.sign({ _id: this._id, email: this.email, role: this.role }, process.env.JwtPrivate_Key, { expiresIn: '12h' });
    return token;
}

userSchema.methods.generateForgetLink = function () {
    const token = Jwt.sign({ _id: this._id, email: this.email, role: this.role }, process.env.JwtPrivate_Pass, { expiresIn: '12h' });
    return token;
}

//hash user password before saving into database
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        email: Joi.string().optional(),
        password: Joi.string(),
        userId: Joi.string().optional().allow(''),
        firstName: Joi.string().optional().allow(''),
        lastName: Joi.string().optional().allow(''),
        contact: Joi.string().optional().allow(''),
        address: Joi.string().optional().allow(''),
        state: Joi.string().optional().allow(''),
        data: Joi.optional().allow(''),
        vehicles: Joi.optional().allow(''),
        role: Joi.string().optional().allow(''),
        activeStatus: Joi.optional().allow(''),
        imageUrl: Joi.string().optional().allow(''),
        otpVerified: Joi.allow('').optional(),
        otpToken: Joi.allow('').optional()

    };

    return Joi.validate(user, schema);
}


exports.userSchema = userSchema;
exports.User = User;
exports.validate = validateUser;
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAysnc = require('../utils/catchAysnc');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        required:[true, 'A user must have a name'],
    },

    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
      },

    photo: String,

    role: {
        type: String,
        required:[true, 'A user must have a name'],
        enum: {
            values: ['user', 'guide', 'lead-guide', 'admin'],
            message: 'A user can either be a regular user, guide, lead-guide or admin'
        },
        default: 'user'
    },

    password: {
        type: String,
        required:[true, 'A user must have a password'],
        minlength: 8,
        select: false
        
    },

    passwordConfirm: {
        type: String,
        required:[true, 'A user must have confirm their password'],
        validate:{
            validator: function(el){ return this.password === el },
            message: 'passwords are not thesame'
        }
    },

    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetTokenExpire: Date,
});

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) return next();
    this.passwordConfirm = undefined;
    this.password = await bcrypt.hash(this.password, 12);
    console.log(this.password)
    next();
});

userSchema.post('save', function(){
    console.log(`from post: ${this.password}`)
    console.log(`from post: ${this}`)
});

userSchema.pre('save', function(next){    
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now();
    console.log(this.passwordChangedAt)
    next();
});

userSchema.methods.createResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');;
    this.resetTokenExpire = Date.now() + 60 * 1000;
    return resetToken;
}

userSchema.methods.checkPassword = function(){

}

userSchema.methods.comparePasswords = async function(userPassword, dbPassword){
    const res = await bcrypt.compare(userPassword, dbPassword);
    console.log(res);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
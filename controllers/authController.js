const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const catchAysnc = require('../utils/catchAysnc');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const signToken = id => {
    const token = jwt.sign({id}, process.env.JWT_SECRET, {
        // expiresIn: '90d'
        expiresIn: process.env.JWT_EXPIRES
    })
    return token;
}

const createSendToken = (user, statsuCode, res) => {
    const token = signToken(user.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_EXPIRES * 60 * 60 * 24 * 1000,
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statsuCode).json({
        status: 'success',
        token,
        data:{
            user
        }
    })
}

exports.signup = catchAysnc( async(req, res, next) => {
    const {name, email, role, password, passwordConfirm} = req.body;
    const user = await User.create({
        name, 
        email,
        role,
        password,
        passwordConfirm
    });

    if(!user){
        return next(new AppError('User not created, please try again', 404))
    }

    createSendToken(user, 201, res);
});

exports.login = catchAysnc( async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return next(new AppError('Please provide an email/password', 400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new AppError('email/password is incorrrect', 400))
    }

    const result = await user.comparePasswords(password, user.password);

    if(result){
        return next(new AppError('email/password is incorrrect', 401))
    }

    const token = signToken(user.id);

    createSendToken(user, 200, res);
})

exports.protect = catchAysnc( async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token  = req.headers.authorization.split(' ')[1];
    }
    if(req.cookies.jwt){
        token  = req.cookies.jwt;
    }
    if(!token){
        return next( new AppError('You are not logged in, please login', 401) );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //check if user just recently updated password
    
    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        return next( new AppError('The user that bears this token does not exist anymore', 404) );
    }

    req.user = currentUser;

    next()
})

exports.isLoggedIn = catchAysnc( async(req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token  = req.headers.authorization.split(' ')[1];
    }
    if(req.cookies.jwt){
        token  = req.cookies.jwt;
    }
    if(!token){
        return next( new AppError('You are not logged in, please login', 401) );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //check if user just recently updated password
    
    const currentUser = await User.findById(decoded.id);

    if(!currentUser){
        return next( new AppError('The user that bears this token does not exist anymore', 404) );
    }

    req.user = currentUser;

    next()
})

exports.restrictTO = (...roles) => (req, res, next) => {
    const filtered = roles.find(el => el === req.user.role);
    if(!filtered){
        return next( new AppError('You are unauthorized to perform this action', 403) );
    }
    next();
}


exports.forgotPassword = catchAysnc(async (req, res, next) => {
    const {email} = req.body;
    const user = User.findOne({ email });
    if(!user){
        return next(new AppError('email is incorrrect', 400))
    }
    const resetToken = user.createResetToken();
    const url = `${req.protocol}://${req.get('host')}/resetpassword/${user.id}/${resetToken}`;
    await user.save({ validateBeforeSave: false });




})
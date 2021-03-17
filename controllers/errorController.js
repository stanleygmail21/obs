const AppError = require('../utils/AppError');
const { default: validator } = require('validator');

const handleValidationError = err => {
    const message = `Invalid input data: ${Object.values(err.errors).map(cur => cur.message).join('. ')}`
    return new AppError(message, 400);
}

const handleUniqueFieldsError = err => {
    const message = `${Object.keys(err.keyPattern)} already exists`
    return new AppError(message, 400);
}

const handleCastError = err => {
    const message = 'please provide a valid id'
    return new AppError(message, 400);
}

const handleJsonWebTokenError = err => {
    const message = 'Invalid token, please try again'
    return new AppError(message, 401);
}

const handleTokenExpiredError = err => {
    const message = 'Token has expired, please login again'
    return new AppError(message, 401);
}

const sendDev = (err, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: err
    });

    next()
}


const sendProd = (err, res, next) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: `${err.message}`
        });

        return next();
    }

    res.status(500).json({
        status: 'error',
        message: `something went wrong`
    });
}

module.exports = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    error.name = err.name;
    if(error.name === 'ValidationError') error = handleValidationError(error);
    if(error.name === 'CastError') error = handleCastError(error);
    if(error.code === 11000) error = handleUniqueFieldsError(error);
    if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error);
    if(error.name === 'TokenExpiredError') error = handleTokenExpiredError(error);
    
    sendProd(error, res, next);
    // sendDev(error, res, next);
    console.log(error)

    next()
}
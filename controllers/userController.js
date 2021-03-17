const User = require('./../models/User');
const AppError = require('../utils/AppError');
const catchAysnc = require('../utils/catchAysnc');

exports.getAllUsers = catchAysnc(async(req, res) => {
    const users = await User.find();
    res.status('200').json({
        status: 'success',
        result: users.length,
        data:{
            users
        }
    });
})

exports.createUser = catchAysnc(async(req, res) => {
    const user = await User.create(req.body);
    if(!user){
        return next(new AppError('User does not exist', 404))
    }
    res.status('201').json({
        status: 'success',
        data:{
            user
        }
    });
})

exports.getUser = catchAysnc(async(req, res, next) => {
    
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new AppError('User does not exist', 404))
    }
        
    res.status('200').json({
        status: 'success',
        data:{
            user
        }
    });
})

exports.updateUser = catchAysnc(async(req, res, next) => {
    const {name, email, role, password} = req.body;
    // if(req.body.password){
    //     return next(new AppError('user password cannot be changed here', 403))
    // }
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true,
    //     runValidators: true    
    // });

    const user = await User.findById(req.params.id).select('+password');
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save({validateBeforeSave: false});

    if(!user){
        return next(new AppError('user does not exist', 404))
    }
    res.status('200').json({
        status: 'success',
        data:{
            user
        }
    });
})

exports.deleteUser = catchAysnc(async(req, res) => {

    const user = await User.findByIdAndDelete(id);
    if(!user){
        return next(new AppError('user does not exist', 404))
    }
    res.status('204').json({
        status: 'success',
        data: null
    });
})
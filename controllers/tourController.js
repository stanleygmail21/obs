const Tour = require('./../models/Tour');
const ApiFeatures = require('../utils/ApiFeatures');
const catchAysnc = require('../utils/catchAysnc');
const AppError = require('../utils/AppError');

// exports.getAllTours = async(req, res, next) => {
//     console.log(req.query);
//     try {
//         apiFeatures = new ApiFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();
//         const tours = await apiFeatures.query;
//         res.status('200').json({
//             status: 'success',
//             result: tours.length,
//             data:{
//                 tours
//             }
//         });
//     } catch (error) {
//         res.status('404').json({
//             status: 'fail',
//             message: `${error}`
//         });
//     }
// }

exports.getAllTours = catchAysnc(async(req, res, next) => {    
    apiFeatures = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldValues()
    .paginate();
    const tours = await apiFeatures.query;
    res.status('200').json({
        status: 'success',
        result: tours.length,
        data:{
            tours
        }
    }) 
})

exports.createTour = async(req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status('201').json({
            status: 'success',
            data:{
                tour
            }
        });
    } catch (error) {
        res.status('404').json({
            status: 'fail',
            message: `${error}`
        });
    }
}

// exports.getTour = async(req, res) => {
//     try {
//         const tour = await Tour.findById(req.params.id);
//         res.status('200').json({
//             status: 'success',
//             data:{
//                 tour
//             }
//         });
//     } catch (error) {
//         res.status('404').json({
//             status: 'fail',
//             message: `${error}`
//         });
//     }
// }


exports.getTour = catchAysnc(async(req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if(!tour){
        return next(new AppError('Tour was not found', 404))
    }

    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    });
})

exports.updateTour = async(req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status('200').json({
            status: 'success',
            data:{
                tour
            }
        });
    } catch (error) {
        res.status('404').json({
            status: 'fail',
            message: `${error}`
        });
    }
}

exports.deleteTour = async(req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status('200').json({
            status: 'success',
            data: null
        });
    } catch (error) {
        res.status('404').json({
            status: 'fail',
            message: `${error}`
        });
    }
}

exports.topFiveExpensiveTours = async(req, res, next) => {
    req.query.fields = 'name,price,duration';
    req.query.sort = '-price,-duration';
    next();
}

exports.getMonthlyStats = async(req, res) => {
    try {
        const aggregate = Tour.aggregate([
            {
                $match: {duration: {$gte: 5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    price: {$avg: '$price'}
                }
            }
        ]);
        console.log(aggregate);
        const tours = await aggregate;

        res.status('200').json({
            status: 'success',
            data: {
                tours
            }
        });
    } catch (error) {
        res.status('404').json({
            status: 'fail',
            message: `${error}`
        });
    }
}
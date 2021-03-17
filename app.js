const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');
const globalErrorHandler = require('./controllers/errorController');
const authController = require('./controllers/authController');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.options('*', cors());


app.use('/api/v1/signup', authController.signup);
app.use('/api/v1/login', authController.login);

app.use('/api/v1/tours',  tourRouter);
app.use('/api/v1/users', userRouter);


app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `${req.originalUrl} not found on this server, please go our homepage ${req.protocol}://${req.get('host')} or try again later`
    });
});

app.use(globalErrorHandler);

module.exports = app;
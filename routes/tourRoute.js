const express = require('express');
const tourController = require('./../controllers/tourController');

router = express.Router();

//use aggregate to get tour stats in a predefined link
router.route('/monthly-stats').get(tourController.getMonthlyStats);
//use middleware to get tour stats in a predefined link
router.route('/top-5-expnsive').get(tourController.topFiveExpensiveTours, tourController.getAllTours);

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);



module.exports = router;
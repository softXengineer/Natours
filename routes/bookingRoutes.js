const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/:id')
  .get(bookingController.getBooking)
  .delete(bookingController.deleteBooking)
  .patch(bookingController.updateBooking);

module.exports = router;

const express = require('express');
const viewsController = require('./../controller/viewsContoller');
const authController = require('./../controller/authController');
const bookingController = require('./../controller/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/login', authController.isLoggedIn, viewsController.login);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.post(
  '/submit-form',
  authController.protect,
  viewsController.updateSettings
);

module.exports = router;

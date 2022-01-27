const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.addTourUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .patch(authController.restrictTo('user'), reviewController.updateReview)
  .delete(authController.restrictTo('user'), reviewController.deleteReview);

module.exports = router;

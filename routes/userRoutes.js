const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.patch('/resetPassword/:token', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);

router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);
router.delete('/deleteMe', userController.deleteMe);
router.patch(
  '/updateMe',
  userController.uploadImage,
  userController.resizeImage,
  userController.updateMe
);
router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .patch(userController.updateUser)
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;

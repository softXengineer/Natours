const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'review',
    fields: 'review user rating'
  });

  if (!tour) {
    return next(new AppError('No tour find with that name!', 404));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour
  });
});

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours overview',
    tours
  });
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login'
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateSettings = catchAsync(async (req, res, next) => {
  const updatedUser = User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  res.status(200).render('overview', {
    title: 'My tours',
    tours
  });
});

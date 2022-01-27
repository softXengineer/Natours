const Stripe = require('stripe');
const dotenv = require('dotenv');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');
const handlerFactory = require('./handlerFactory');

dotenv.config({ path: './config.env' });

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = handlerFactory.getAll('Booking');
exports.getBooking = handlerFactory.getOne('Booking');
exports.deleteBooking = handlerFactory.deleteOne('Booking');
exports.updateBooking = handlerFactory.updateOne('Booking');
exports.createBooking = handlerFactory.createOne('Booking');

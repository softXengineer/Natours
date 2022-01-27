const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');

// const signToken = id => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_INSPIRES_IN
//   });
// };

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_INSPIRES_IN
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_INSPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photo: req.body.photo
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!'));
  }
  const user = await User.findOne({ email }).select('password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password!'));
  }
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access!', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging this token no longer exist!', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. PLease log in again!', 401)
    );
  }

  res.locals.user = currentUser;
  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email!', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}
    /api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token send to email!'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) chech if POSTed current password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError('Your password is wrong!', 401));
  }
  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   message: 'Password updated',
  //   token
  // });
});

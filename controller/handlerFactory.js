const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Review = require('./../models/reviewModel');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No data found by this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No data found by this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No data found by this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { data: doc }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const apiFeatures = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await apiFeatures.query.explain();
    const docs = await apiFeatures.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs }
    });
  });

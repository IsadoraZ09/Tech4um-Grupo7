const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const Forum = require("../models/forumModel");

exports.getAllForums = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Forum.find({}), req.query);

  features.filter().sort().selectFields().paginate();

  const forums = await features.mongoQuery;

  res.status(200).json({
    status: 'success',
    results: forums.length,
    data: {
      forums,
    },
  });
});

exports.getForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id);

  if (!forum) {
    return next(new AppError('Could not find this forum', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      forum,
    },
  });
});

exports.createForum = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const newForum = await Forum.create({
    name,
    description,
  });

  res.status(201).json({
    status: 'success',
    data: {
      forum: newForum,
    },
  });
});

exports.updateForum = catchAsync(async (req, res, next) => {
  const updatedForum = await Forum.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedForum) {
    return next(new AppError('Could not find this forum', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      forum: updatedForum,
    },
  });
});

exports.deleteForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findByIdAndDelete(req.params.id);

  if (!forum) {
    return next(new AppError('Could not find this forum', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Mantém compatibilidade com código antigo
exports.list = exports.getAllForums;
exports.create = exports.createForum;
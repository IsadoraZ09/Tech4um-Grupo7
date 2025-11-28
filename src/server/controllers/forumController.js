const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');
const Forum = require("../models/forumModel");

exports.getAllForums = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Forum.find(), req.query);
  
  features.filter().sort().selectFields().paginate();

  const forums = await features.mongoQuery
    .populate('creator', 'username email')
    .lean();

  res.status(200).json({
    status: 'success',
    results: forums.length,
    data: {
      forums,
    },
  });
});

exports.getForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id)
    .populate('creator', 'username email')
    .populate('members', 'username email');

  if (!forum) {
    return next(new AppError('Fórum não encontrado', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      forum,
    },
  });
});

exports.createForum = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  const newForum = await Forum.create({
    title,
    description,
    creator: req.user._id, // Pega do middleware protect
  });

  await newForum.populate('creator', 'username email');

  res.status(201).json({
    status: 'success',
    data: {
      forum: newForum,
    },
  });
});

exports.updateForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id);

  if (!forum) {
    return next(new AppError('Fórum não encontrado', 404));
  }

  // Verificar se o usuário é o criador
  if (forum.creator.toString() !== req.user._id.toString()) {
    return next(new AppError('Você não tem permissão para editar este fórum', 403));
  }

  const updatedForum = await Forum.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    {
      new: true,
      runValidators: true,
    }
  ).populate('creator', 'username email');

  res.status(200).json({
    status: 'success',
    data: {
      forum: updatedForum,
    },
  });
});

exports.deleteForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id);

  if (!forum) {
    return next(new AppError('Fórum não encontrado', 404));
  }

  // Verificar se o usuário é o criador ou admin
  if (forum.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('Você não tem permissão para deletar este fórum', 403));
  }

  await Forum.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.joinForum = catchAsync(async (req, res, next) => {
  const forum = await Forum.findById(req.params.id);

  if (!forum) {
    return next(new AppError('Fórum não encontrado', 404));
  }

  // Verificar se já é membro
  if (forum.members.includes(req.user._id)) {
    return next(new AppError('Você já é membro deste fórum', 400));
  }

  forum.members.push(req.user._id);
  await forum.save();

  await forum.populate('creator', 'username email');

  res.status(200).json({
    status: 'success',
    data: { 
      forum 
    }
  });
});
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Message = require("../models/messageModel");

exports.getByForum = catchAsync(async (req, res, next) => {
  const messages = await Message.find({ forumId: req.params.forumId });

  if (!messages) {
    return next(new AppError('No messages found for this forum', 404));
  }

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages,
    },
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  // Apenas o remetente ou admin pode deletar
  if (message.sender !== req.user.email && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this message', 403));
  }

  await Message.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
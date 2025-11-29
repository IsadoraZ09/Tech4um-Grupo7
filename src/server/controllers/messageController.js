const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Message = require("../models/messageModel");
const mongoose = require('mongoose');

exports.getByForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    
    console.log("🔍 Buscando mensagens para fórum:", forumId);
    
    // Validar se forumId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(forumId)) {
      return res.status(400).json({
        success: false,
        message: 'ID do fórum inválido'
      });
    }

    // Buscar mensagens do fórum
    const messages = await Message.find({ forumId })
      .populate('sender', 'username email avatar')
      .populate('to', 'username email avatar')
      .sort({ createdAt: 1 }); // Ordenar por data de criação (mais antigas primeiro)
    
    console.log("📜 Mensagens encontradas:", messages.length);
    
    // Converter imagens para base64 se existirem
    const messagesWithImages = messages.map(message => {
      const messageObj = message.toObject();
      
      if (messageObj.image?.data) {
        const base64Image = messageObj.image.data.toString('base64');
        messageObj.image = {
          ...messageObj.image,
          data: `data:${messageObj.image.contentType};base64,${base64Image}`
        };
      }
      
      return messageObj;
    });

    res.json({
      success: true,
      data: { 
        messages: messagesWithImages,
        count: messagesWithImages.length
      }
    });
    
  } catch (error) {
    console.error("❌ Erro ao buscar mensagens:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      sender: req.user._id // Usar o usuário autenticado
    };

    const message = await Message.create(messageData);
    const populatedMessage = await Message.findById(message._id);

    res.status(201).json({
      success: true,
      data: { message: populatedMessage }
    });
    
  } catch (error) {
    console.error("❌ Erro ao criar mensagem:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Buscar a mensagem
    const message = await Message.findById(id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensagem não encontrada'
      });
    }

    // Verificar se o usuário é o autor da mensagem
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode deletar suas próprias mensagens'
      });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    });
    
  } catch (error) {
    console.error("❌ Erro ao deletar mensagem:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};
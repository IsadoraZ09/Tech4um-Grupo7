const express = require('express');
const authController = require('../controllers/authController');
const messageController = require("../controllers/messageController");

const router = express.Router();

// Protege todas as rotas abaixo com autenticação
router.use(authController.protect);

// Rotas para mensagens
router.get("/:forumId", messageController.getByForum); // Buscar mensagens por fórum
router.post("/", messageController.createMessage); // Criar mensagem (se necessário)
router.delete("/:id", messageController.deleteMessage); // Deletar mensagem

module.exports = router;
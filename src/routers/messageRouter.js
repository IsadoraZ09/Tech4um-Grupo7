const express = require('express');
const authController = require('../controllers/authController');
const message = require("../controllers/messageController");

const router = express.Router();

// Protege todas as rotas abaixo com autenticação
router.use(authController.protect);

router.get("/:forumId", message.getByForum);
router.delete("/:id", message.deleteMessage);

module.exports = router;
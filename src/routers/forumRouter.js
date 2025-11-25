const express = require('express');
const authController = require('../controllers/authController');
const forum = require("../controllers/forumController");

const router = express.Router();

// Rotas públicas (sem autenticação)
router.get("/", forum.getAllForums);
router.get("/:id", forum.getForum);

// Rotas protegidas (requerem autenticação)
router.use(authController.protect);

router.post("/", forum.createForum);
router.patch("/:id", forum.updateForum);
router.delete("/:id", forum.deleteForum);
router.patch('/:id/join', forum.joinForum);

module.exports = router;
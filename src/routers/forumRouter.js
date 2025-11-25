const express = require('express');
const authController = require('../controllers/authController');
const forum = require("../controllers/forumController");

const router = express.Router();

// Protege todas as rotas abaixo com autenticação
router.use(authController.protect);

router.route("/")
  .get(forum.getAllForums)
  .post(forum.createForum);

router.route("/:id")
  .get(forum.getForum)
  .patch(forum.updateForum)
  .delete(forum.deleteForum);

module.exports = router;
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:resetToken', authController.resetPassword);

// Rotas protegidas (requerem autenticação)
router.use(authController.protect);

router.use(authController.restrictTo('admin'));


module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.socialLogin('google'));
router.get('/google/callback', authController.socialCallback('google'));
router.get('/facebook', authController.socialLogin('facebook'));
router.get('/facebook/callback', authController.socialCallback('facebook'));
router.get('/microsoft', authController.socialLogin('microsoft'));
router.get('/microsoft/callback', authController.socialCallback('microsoft'));

module.exports = router;

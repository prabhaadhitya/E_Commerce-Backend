const { Router } = require('express');
const { authMiddleware, requireAdmin } = require('../middlewares/authMiddleware');
const { getSignedUrl } = require('../controllers/uploadController');

const uploadRouter = Router();

uploadRouter.post('/signed-url', authMiddleware, requireAdmin, getSignedUrl);

module.exports = uploadRouter;
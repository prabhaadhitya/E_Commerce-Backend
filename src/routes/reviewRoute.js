const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addReview, listReviews } = require('../controllers/reviewController');

const reviewRouter = Router();

reviewRouter.post('/:productId/reviews', authMiddleware, addReview);
reviewRouter.get('/:productId/reviews', authMiddleware, listReviews);

module.exports = reviewRouter;

const { Router } = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addReview, listReviews } = require('../controllers/reviewController');

const reviewRouter = Router();

reviewRouter.post('/:id', authMiddleware, addReview);
reviewRouter.get('/:id', listReviews);

module.exports = reviewRouter;

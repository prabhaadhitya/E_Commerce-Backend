const Review = require('../models/review');

const addReview = async (req, res) => {
    try {
        const {rating, comment} = req.body;
        const productId = parseInt(req.params.productId);
        if (!Number.isInteger(productId)) {
            return res.status(400).json({ message: 'Invalid productId' });
        }
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        const userId = req.user.id;
        const review = await Review.create({ productId, userId, rating, comment });
        res.status(201).json({message: 'Review added successfully', review});
    } catch (error) {
        console.log('Error adding review:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

const listReviews = async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(50);
        res.status(200).json({reviews});
    } catch (error) {
        console.log('Error listing reviews:', error);
        res.status(500).json({message: 'Internal server error'});
    }
};

module.exports = { addReview, listReviews };
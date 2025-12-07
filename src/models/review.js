const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: {type: Number, required: true},
    userId: {type: Number, required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String},
    createdAt: {type: Date, default: Date.now}
});  

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
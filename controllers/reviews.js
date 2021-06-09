const Review = require("../models/review");
const Photos = require("../models/photos");

module.exports.createReview = async (req, res) => {
    const photo = await Photos.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.date = new Date().toLocaleDateString("en-US");
    photo.reviews.push(review);
    await review.save();
    await photo.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/photos/${photo._id}`);
};

module.exports.deleteReview = async (req, res) => {
    await Photos.findByIdAndUpdate(req.params.id, { $pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/photos/${req.params.id}`);
};

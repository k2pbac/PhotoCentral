const catchAsync = require("./utils/catchAsync");
const Photos = require("./models/photos");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { photoSchema, reviewSchema } = require("./schemas.js");

//Users middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in to view this page.");
        return res.redirect("/login");
    }
    next();
}
module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const photo = await Photos.findById(id);
    if (!photo.userID.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/photos/${id}`);
    }
    next();
});

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/photos/${id}`);
    }
    next();
});

//Photo middleware
module.exports.validatePhoto = (req, res, next) => {
    const { error } = photoSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//Reviews middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
const express = require("express");
const router = express.Router({ mergeParams: true });

//Error Handlers
const catchAsync = require("../utils/catchAsync");

const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

const reviewController = require("../controllers/reviews");

//new review POST route
router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));


module.exports = router;
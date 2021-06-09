const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

//Async Error Hanndler
const catchAsync = require("../utils/catchAsync");

const photoController = require("../controllers/photos");
const { isLoggedIn, isAuthor, validatePhoto } = require("../middleware");

//all photos GET and POST route
router.route("/")
    .get(catchAsync(photoController.index))
    .post(isLoggedIn, upload.array('image'), validatePhoto, catchAsync(photoController.createPhoto));


//new photo GET route
router.get("/new", isLoggedIn, photoController.renderNewForm);

router.route("/:id")
    .get(catchAsync(photoController.showPhoto))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePhoto, catchAsync(photoController.updatePhoto))
    .delete(isLoggedIn, isAuthor, catchAsync(photoController.deletePhoto));

//edit photo GET route
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(photoController.renderEditForm));



module.exports = router;
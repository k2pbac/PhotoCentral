const Photos = require("../models/photos");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const photos = await Photos.find({});
    res.render("photos", { photos });
};

module.exports.renderNewForm = (req, res) => {
    res.render("photos/new")
};

module.exports.createPhoto = async (req, res, next) => {
    const photo = new Photos(req.body.photo);
    photo.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    photo.userID = req.user._id;
    await photo.save();
    req.flash('success', 'Successfully inserted a new photo!');
    res.redirect(`/photos/${photo._id}`);
};

module.exports.showPhoto = async (req, res) => {
    const { id } = req.params;
    const photo = await Photos.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('userID');
    if (!photo) {
        req.flash('error', 'Photo not found')
        return res.redirect("/photos");
    }
    res.render("photos/show", { photo });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const photo = await Photos.findById(id);
    if (!photo) {
        req.flash('error', 'Photo not found')
        return res.redirect("/photos");
    }
    res.render("photos/edit", { photo })
};

module.exports.updatePhoto = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const updatePhoto = await Photos.findByIdAndUpdate(id, { ...req.body.photo });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatePhoto.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatePhoto.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await updatePhoto.save();
    req.flash('success', 'Successfully updated photo!');
    res.redirect(`/photos/${id}`);
};

module.exports.deletePhoto = async (req, res) => {
    const { id } = req.params;
    await Photos.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted photo!');
    res.redirect('/photos');
};
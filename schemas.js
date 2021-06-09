const Joi = require("joi");

module.exports.photoSchema = Joi.object({
    photo: Joi.object({
        name: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        dateCaptured: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
        date: Joi.string()
    }).required()
});
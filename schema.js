const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required"
        }),
        description: Joi.string().required(),
        image: Joi.string().uri().allow("").optional(),
        price: Joi.number().min(0).required().messages({
            "number.min": "Price cannot be negative"
        }),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});
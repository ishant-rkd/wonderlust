const joi=require("joi");

module.exports.listingSchema= joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
        image: joi.object({
            url: joi.string().allow("",null).required(),
            filename: joi.string().default("listingimage")
            }).required(),
    }).required(),
})

module.exports.reviewSchema= joi.object({
    review:joi.object({
        reting:joi.number().required().min(1).max(5),
        comment:joi.string().required()
    }).required(),
})
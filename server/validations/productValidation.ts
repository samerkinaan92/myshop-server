import joi from 'joi';

export const newProductSchema = joi.object({
    _id: joi.equal(null),
    categoryId: joi.string().required(),
    imgUrl: joi.string().required(),
    title: joi.string().required(),
    price: joi.number().min(0.01).required(),
    description: joi.string().allow('')
});

export const updateProductSchema = joi.object({
    _id: joi.string().length(24).required(),
    categoryId: joi.string().required(),
    imgUrl: joi.string().required(),
    title: joi.string().required(),
    price: joi.number().greater(0).required(),
    description: joi.string().allow('')
});
import joi from 'joi';

export const newCartSchema = joi.object({
    productId: joi.string().length(24).required(),
    quantity: joi.number().greater(0).integer().required()
});
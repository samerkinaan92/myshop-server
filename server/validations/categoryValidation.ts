import joi from 'joi';

export const newCategorySchema = joi.object({
    title: joi.string().required()
});
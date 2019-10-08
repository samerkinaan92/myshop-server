import joi from 'joi';

export const newUserSchema = joi.object({
    username: joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/),

    repeat_password: joi.string()
        .equal(joi.ref('password'))
        .required()
});
import { Request, Response, NextFunction, Router } from 'express';
import { Category } from '../models/Category';
import { newCategorySchema } from '../validations/categoryValidation';
import joi from 'joi';
import mongoose from 'mongoose';
import { checkAuth } from '../middlewares/check-auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    Category.find()
        .exec()
        .then(docs => {
            res.status(200).send(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

router.post('/', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    if (res.locals.userData.type !== 'Admin') {
        return res.sendStatus(401);
    }

    const { error, value } = joi.validate(req.body, newCategorySchema);
    if (error) {
        return next(error);
    }

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title
    });

    category.save()
        .then(result => {
            res.status(201).send(result);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

router.delete('/:id', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    if (res.locals.userData.type !== 'Admin') {
        return res.sendStatus(401);
    }

    const id = req.params.id;
    Category.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

export { router };
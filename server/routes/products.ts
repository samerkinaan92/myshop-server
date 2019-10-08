import { Request, Response, NextFunction, Router } from 'express';
import { Product } from '../models/Product';
import { newProductSchema, updateProductSchema } from '../validations/productValidation';
import joi from 'joi';
import mongoose from 'mongoose';
import { checkAuth } from '../middlewares/check-auth';

const router = Router();

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).send(doc);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

router.get('/', (req: Request, res: Response) => {
    Product.find()
        .exec()
        .then(docs => {
            res.status(200).send(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

router.post('/', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    if(res.locals.userData.type !== 'admin'){
        return res.sendStatus(401);
    }

    const { error, value } = joi.validate(req.body, newProductSchema);
    if (error) {
        return next(error);
    }

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        categoryId: req.body.categoryId,
        imgUrl: req.body.imgUrl,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description
    });

    product.save()
        .then(result => {
            res.status(201).send(result);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

router.put('/:id', checkAuth, (req: Request, res: Response, next: NextFunction) => {
    
    if(res.locals.userData.type !== 'admin'){
        return res.sendStatus(401);
    }
    
    const id = req.params.id;
    const { error, value } = joi.validate(req.body, updateProductSchema);
    if (error) {
        next(error);
    }

    Product.update({ _id: id }, {
        $set:
        {
            categoryId: req.body.categoryId,
            imgUrl: req.body.imgUrl,
            title: req.body.title,
            price: req.body.price,
            description: req.body.description
        }
    })
        .exec()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        })
});


router.delete('/:id', checkAuth, (req: Request, res: Response, next: NextFunction) => {
    
    if(res.locals.userData.type !== 'admin'){
        return res.sendStatus(401);
    }
    
    const id = req.params.id;
    Product.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


export { router };
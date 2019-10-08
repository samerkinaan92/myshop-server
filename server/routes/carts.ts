import { Request, Response, NextFunction, Router } from 'express';
import { checkAuth } from '../middlewares/check-auth';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { newCartSchema } from '../validations/cartValidation';
import joi from 'joi';

const router = Router();

router.get('/:username', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    const username = req.params.username;
    if (res.locals.userData.username !== username) {
        return res.sendStatus(401);
    }

    User.findOne({ username })
        .select('cart')
        .exec()
        .then(doc => {
            const ids = ((doc as any).cart as [{ productId: string, quantity: number }]).map(cartItem => cartItem.productId);
            Product.find({
                '_id':
                    { $in: ids }
            })
                .select('_id categoryId imgUrl title price description')
                .exec()
                .then(docs => {
                    const cart = (docs as any).map((product: any) => {
                        const foundItem = ((doc as any).cart as [{ productId: string, quantity: number }])
                            .find(item => {
                                return item.productId.toString() === product._id.toString();
                            });
                        if (foundItem) {
                            return { product, quantity: foundItem.quantity };
                        }
                    });
                    res.status(200).send(cart);
                })
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.post('/:username', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    const username = req.params.username;
    if (res.locals.userData.username !== username) {
        return res.sendStatus(401);
    }

    const { error, value } = joi.validate(req.body, newCartSchema);
    if (error) {
        return next(error);
    }

    Product.findById(req.body.productId).exec()
        .then(doc => {
            if (doc) {
                console.log(req.body);
                User.updateOne({ username }, { $push: { cart: req.body } }).exec()
                    .then(result => {
                        return res.status(201).send(result);
                    })
                    .catch(err => {
                        return res.status(500).send(err);
                    });
            } else {
                return res.status(404).send({
                    message: 'product id does not exist'
                });
            }
        })
        .catch(err => {
            return res.status(500).send(err);
        });
});

router.patch('/:username', checkAuth, (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;
    if (res.locals.userData.username !== username) {
        return res.sendStatus(401);
    }

    const { error, value } = joi.validate(req.body, newCartSchema);
    if (error) {
        return next(error);
    }

    User.updateOne({ username, 'cart.productId': req.body.productId },
        {
            '$set':
                { 'cart.$.quantity': req.body.quantity }
        })
        .exec()
        .then(doc => {
            res.status(200).send(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});

router.delete('/:username.:productId', checkAuth, (req: Request, res: Response, next: NextFunction) => {

    const username = req.params.username;
    if (res.locals.userData.username !== username) {
        return res.sendStatus(401);
    }

    const productId = req.params.productId;
    User.updateOne({ username },
        {
            $pull:
            {
                cart:
                    { productId }
            }
        })
        .exec()
        .then(doc => {
            res.status(200).send(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
})

export { router };
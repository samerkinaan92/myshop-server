import { Request, Response, NextFunction, Router } from 'express';
import { newUserSchema } from '../validations/userValidation'
import joi from 'joi';
import { User } from '../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const router = Router();

router.post('/signup', (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = joi.validate(req.body, newUserSchema);
    if (error) {
        return next(error);
    }

    User.findOne({ username: req.body.username }).exec()
        .then(doc => {
            if (doc) {
                res.sendStatus(409);
                return;
            } else {
                bcrypt.hash(req.body.password, 10, (err: Error, hash: string): void => {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            password: hash,
                            type: 'user'
                        });
                        user.save()
                            .then(result => {
                                res.status(201).send(result);
                                return;
                            })
                            .catch(err => {
                                res.sendStatus(500);
                                return;
                            })
                    }
                });
            }
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

router.post('/login', (req: Request, res: Response, next: NextFunction): void => {
    User.findOne({ username: req.body.username }).exec()
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, (user as any).password, (err: Error, result: boolean): void => {
                    if (err) {
                        res.sendStatus(401);
                        return;
                    }
                    if (result) {
                        if (process.env.JWT_KEY !== undefined) {
                            const token = jwt.sign({
                                username: (user as any).username,
                                userId: user._id,
                                type: (user as any).type
                            }, process.env.JWT_KEY);
                            res.status(200).send({
                                message: "Auth successful",
                                token: token,
                                type: (user as any).type
                            });
                            return;
                        }
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(401);
                    return;
                });
            } else {
                res.sendStatus(401);
            }
        })
        .catch(err => {
            res.sendStatus(500);
        });
});


router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
    User.remove({ _id: req.params.id }).exec()
        .then(result => {
            res.sendStatus(200);
        })
        .catch(err => {
            res.sendStatus(500);
        });
});

export { router };
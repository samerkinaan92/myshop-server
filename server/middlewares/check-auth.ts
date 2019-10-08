import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (process.env.JWT_KEY !== undefined && req.headers.authorization !== undefined) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            res.locals.userData = decoded;
            next();
        } catch (err) {
            res.sendStatus(401);
            return;
        }
    } else {
        res.sendStatus(500);
        return;
    }
}
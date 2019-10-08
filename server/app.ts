import express from 'express';
import path from 'path';
import cors from 'cors';
import { router as productsRouter } from './routes/products';
import { router as categoriesRouter } from './routes/categories';
import { router as usersRouter } from './routes/users';
import { router as cartsRouter} from './routes/carts'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}


const app = express();

mongoose.connect(`mongodb+srv://Samer:${process.env.MONGO_ATLAS_PW}@angilar-shop-lms3g.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(error => console.log(error));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend/dist/myshop')));

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/users', usersRouter);
app.use('/api/carts', cartsRouter);


app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/myshop/index.html')));

export { app };

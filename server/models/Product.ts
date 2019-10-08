import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryId: { type: String, required: true },
    imgUrl: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String
});

const Product = mongoose.model('Product', productSchema);

export { Product }


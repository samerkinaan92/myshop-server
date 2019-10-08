import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true }
});

const Category = mongoose.model('Category', categorySchema);

export { Category }
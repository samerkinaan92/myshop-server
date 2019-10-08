import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
    cart: [{
        productId: Schema.Types.ObjectId,
        quantity: Number,
        _id: false
    }]
});

const User = mongoose.model('User', userSchema);

export { User }
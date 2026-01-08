const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // Account Info
    email: { type: String, required: true, unique: true },
    password: { type: String, default: '123456' }, 
    date: { type: Date, default: Date.now },

    // Full Billing Details (Added all fields)
    firstname: String,
    lastname: String,
    country: String,
    street: String,
    apartment: String, // <--- Added Apartment
    city: String,
    postcode: String,
    phone: String,

    // Shipping Details container
    shipping: {
        firstname: String,
        lastname: String,
        street: String,
        city: String,
        postcode: String
    }
});

module.exports = mongoose.model('User', UserSchema);
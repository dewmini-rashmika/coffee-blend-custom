const mongoose = require('mongoose');

const AccountInfoSchema = new mongoose.Schema({
    // 1. BILLING SNAPSHOT (Matches User Model)
    billing: {
        firstname: String,
        lastname: String,
        country: String,
        street: String,
        apartment: String, // <--- Added Apartment
        city: String,
        postcode: String,
        phone: String,
        email: String,
        createAccount: Boolean,
        shipDifferent: Boolean
    },

    // 2. SHIPPING SNAPSHOT
    shipping: {
        firstname: String,
        lastname: String,
        street: String,
        city: String,
        postcode: String
    },

    // 3. CART ITEMS (Full Details)
    items: [
        {
            name: String,
            price: Number,
            quantity: Number,
            total: Number,
            image: String
        }
    ],

    // 4. TOTALS
    grandTotal: Number,
    orderDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AccountInfo', AccountInfoSchema);
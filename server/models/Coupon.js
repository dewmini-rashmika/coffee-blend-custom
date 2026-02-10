const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentDiscount: { type: Number, default: 0 }, // e.g., 10 for 10%
    flatDiscount: { type: Number, default: 0 },    // e.g., 5 for $5 off
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', CouponSchema);
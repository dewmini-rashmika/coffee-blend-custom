const express = require('express');
const router = express.Router();
const AccountInfo = require('../models/AccountInfo'); //

// Polled by ESP8266 every 3 seconds
router.get('/pending', async (req, res) => {
    try {
        const order = await AccountInfo.findOne({ status: 'pending' }).sort({ orderDate: 1 });
        if (order) {
            return res.json({
                found: true,
                id: order._id, //
                customer: order.billing.firstname, // Matches doc["customer"]
                item: order.items[0]?.name || "New Order" // Matches doc["item"]
            });
        }
        res.json({ found: false });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Triggered by Barista physical button
router.post('/ready', async (req, res) => {
    try {
        await AccountInfo.findByIdAndUpdate(req.body.id, { status: 'ready' });
        res.json({ message: "Order is ready!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
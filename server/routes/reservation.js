const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// POST: Create a new reservation
router.post('/', async (req, res) => {
    try {
        const newBooking = new Reservation({
            name: req.body.name,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            person: req.body.person
        });

        const savedBooking = await newBooking.save();
        res.status(201).json({ message: "Table Booked Successfully!", data: savedBooking });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
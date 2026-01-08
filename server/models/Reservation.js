// server/models/Reservation.js
const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    phone: String,
    date: String,
    time: String,
    message: String,
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
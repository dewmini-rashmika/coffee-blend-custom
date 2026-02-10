const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// IMPORT MODELS
const Reservation = require('./models/Reservation'); 
const AccountInfo = require('./models/AccountInfo'); 
const User = require('./models/User'); 
const Contact = require('./models/Contact');
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// CONNECT TO MONGODB
mongoose.connect('mongodb://localhost:27017/coffee_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));


// ==========================================
// ROUTE 1: REGISTER ACCOUNT (SAVES FULL DETAILS)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        console.log("👤 Registering Full User:", req.body);
        
        // 1. Check duplicate
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // 2. Create User using ENTIRE request body 
        // (Includes firstname, lastname, apartment, phone, etc.)
        const newUser = new User(req.body);

        await newUser.save();
        console.log("✅ User Saved with Full Details");
        res.status(200).json({ message: "Account Created Successfully!" });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Server Error during Registration" });
    }
});

// ==========================================
// ROUTE 5: CONTACT FORM MESSAGES
// ==========================================
app.post('/api/contact', async (req, res) => {
    try {
        console.log("📩 New Message Received:", req.body);
        
        const newMessage = new Contact(req.body);
        await newMessage.save();
        
        console.log("✅ Message Saved to DB");
        res.status(200).json({ message: "Message Sent Successfully!" });
    } catch (error) {
        console.error("❌ Contact Error:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});
// ==========================================
// ROUTE 2: SAVE SHIPPING (UPDATES USER)
// ==========================================
app.post('/api/shipping', async (req, res) => {
    try {
        const { email, shipping } = req.body;
        console.log(`🚚 Updating Shipping for ${email}:`, shipping);

        if (!email) {
            return res.status(400).json({ message: "Email missing. Please fill Billing section." });
        }

        // Find User by Email -> Update 'shipping' field
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { $set: { shipping: shipping } },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found. Please click 'Save Account' first!" });
        }

        console.log("✅ User Shipping Updated");
        res.status(200).json({ message: "Shipping Linked to User Account!" });

    } catch (error) {
        console.error("❌ Shipping Save Error:", error);
        res.status(500).json({ error: "Server Error during Shipping Save" });
    }
});


// ==========================================
// ROUTE 3: PLACE ORDER (SAVES ITEMS & DETAILS)
// ==========================================
app.post('/api/order', async (req, res) => {
    try {
        console.log("📦 Received Full Order:", req.body);
        
        // --- IOT UPDATE: FORCE STATUS 'PENDING' ---
        // We spread (...req.body) and override 'status' to ensure it is 'pending'
        const orderData = { 
            ...req.body, 
            status: 'pending' 
        };

        const newOrder = new AccountInfo(orderData);
        
        await newOrder.save();
        console.log("✅ Order Saved with Status: PENDING");
        res.status(201).json({ message: "Order Placed!", orderId: newOrder._id });
    } catch (error) {
        console.error("❌ Order Error:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});


// ==========================================
// ROUTE 4: RESERVATIONS
// ==========================================
app.post('/api/reservation', async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.status(201).json({ message: "Reservation Saved!" });
    } catch (error) {
        console.error("❌ Reservation Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});
// ==========================================
// ROUTE 6: IOT - CHECK PENDING ORDERS (Hardware Polling)
// ==========================================
app.get('/api/iot/pending', async (req, res) => {
    try {
        // Find the oldest order that is still 'pending'
        const order = await AccountInfo.findOne({ status: 'pending' }).sort({ orderDate: 1 });
        
        if (order) {
            // --- SAFETY CHECK START ---
            // If the order exists but has NO items (Empty array), handle it safely
            let itemName = "Mystery Item";
            
            if (order.items && order.items.length > 0) {
                itemName = order.items[0].name;
            } else {
                console.log(`⚠️ Warning: Order ${order._id} has no items!`);
            }
            // --- SAFETY CHECK END ---

            res.json({
                found: true,
                id: order._id,
                customer: order.billing.firstname || "Customer", 
                item: itemName 
            });
        } else {
            res.json({ found: false });
        }
    } catch (error) {
        console.error("❌ IoT Pending Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});


// ==========================================
// ROUTE 7: IOT - MARK ORDER READY (Button Press)
// ==========================================
app.post('/api/iot/ready', async (req, res) => {
    try {
        const { id } = req.body;
        // Find order by ID and update status to 'ready'
        await AccountInfo.findByIdAndUpdate(id, { status: 'ready' });
        
        console.log(`✅ Order ${id} marked as READY by Barista`);
        res.json({ success: true });
    } catch (error) {
        console.error("❌ IoT Ready Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});


// ==========================================
// ROUTE 8: TRACKING - CHECK STATUS (Web Tracking Page)
// ==========================================
app.get('/api/order/:id', async (req, res) => {
    try {
        const order = await AccountInfo.findById(req.params.id);
        if (order) {
            res.json({ status: order.status });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("❌ Tracking Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
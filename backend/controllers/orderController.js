import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "usd";
const deliveryCharge = 500; // Amount in cents
const frontend_URL = 'http://localhost:4000';

// Placing User Order with Stripe
export const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, status, date, payment } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: 'All required fields must be provided' });
        }

        const newOrder = await Order.create({
            userid: userId,
            items,
            amount,
            address,
            status,
            date,
            payment
        });

        const line_items = items.map((item) => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder.id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder.id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error('Error placing order with Stripe:', error);
        res.status(500).json({ success: false, message: 'Error placing order' });
    }
};


export const placeOrderCod = async (req, res) => {
    try {
        const { userId, address, items, amount, payment, date, status } = req.body;

        if (!userId || !items || !amount || !address) {
            return res.status(400).json({ success: false, message: 'User ID, items, amount, and address are required' });
        }

        const order = await Order.create({
            userid: userId,
            address,
            items,
            amount,
            payment,
            date,
            status
        });

        res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        console.error('Error placing COD order:', error);
        res.status(500).json({ success: false, message: 'Error placing COD order' });
    }
};


// User Orders for Frontend
export const userOrders = async (req, res) => {
    try {
        // Check if req.user is defined and has an id
        if (!req.user || !req.user.id) {
            console.error("User ID not found in request");
            return res.status(400).json({ success: false, message: "User ID is not available" });
        }

        // Retrieve orders for the specific user
        const orders = await Order.findAll({ where: { userid: req.user.id } });

        // Check if orders are found
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }

        // Respond with the list of orders
        res.json({ success: true, data: orders });
    } catch (error) {
        // Log the error and respond with a 500 status
        console.error("Error retrieving user orders:", error);
        res.status(500).json({ success: false, message: "Error retrieving user orders" });
    }
};



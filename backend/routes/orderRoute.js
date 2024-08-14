import express from 'express';
import {  placeOrder, userOrders, placeOrderCod } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js'

const orderRouter = express.Router();

orderRouter.post("/userorders",authMiddleware, userOrders);
orderRouter.post("/place", placeOrder);
orderRouter.post("/placecod", placeOrderCod);

export default orderRouter;

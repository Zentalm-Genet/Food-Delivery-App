import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config(); 

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// api endpoints
app.use('/api/auth', authRoutes); 
app.use('/api/user', userRouter);
app.use('/api/order', orderRouter);



app.listen(port, () => console.log(`Server started on http://localhost:${port}`));

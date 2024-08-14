import express from 'express';
import { loginUser,registerUser, fetchUser   } from '../controllers/userController.js';
const userRouter = express.Router();


userRouter.post("/login",loginUser); 
userRouter.post("/register",registerUser);
userRouter.get('/profile', fetchUser); 

export default userRouter;
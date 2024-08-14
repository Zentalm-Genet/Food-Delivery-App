import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token and attach decoded user information to request
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        console.log('User decoded from token:', req.user); // Debugging log
        next();
    } catch (error) {
        console.error('Token verification failed:', error); 
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;

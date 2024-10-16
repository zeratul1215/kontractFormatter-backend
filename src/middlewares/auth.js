const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if(!authHeader){
        return res.status(401).json({ message: 'access denied' });
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(400).json({ message: 'access denied' });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Yx7b$9u@D!rKpWz3Lg#tMq4XeVf^AhNc';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Store user info in req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;

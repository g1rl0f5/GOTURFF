// middleware/managerMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

const managerMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied: Managers only' });
      console.log("🔐 managerMiddleware decoded token:", decoded);

    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = managerMiddleware;

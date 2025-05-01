const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided or bad format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🔐 Incoming Token:", token);
    console.log("🧬 JWT_SECRET:", process.env.JWT_SECRET); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; 

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized or invalid token. Please log in again." });
  }
};

module.exports = verifyUser;


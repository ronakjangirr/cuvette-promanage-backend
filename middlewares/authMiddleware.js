const jwt = require('jsonwebtoken');

// JWT Token Middleware
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: No token provided',
    });
  }

  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Attach the user ID to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Invalid token',
    });
  }
};

module.exports = authMiddleware;

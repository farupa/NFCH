const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Please login first' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nfch_secret_key');

    // Add user info to request
    req.user = decoded;
    next();

  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};
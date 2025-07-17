// backend/middleware/isAdmin.js

/**
 * Middleware to check if the authenticated user is an admin.
 * Assumes that req.user is already populated (e.g., by a JWT auth middleware).
 */
module.exports = function (req, res, next) {
  // Check if user is authenticated and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  // Forbidden: user is not an admin
  return res.status(403).json({ message: 'Admin access required' });
};

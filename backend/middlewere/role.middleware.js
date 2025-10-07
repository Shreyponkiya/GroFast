module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
      }
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Access denied: ${req.user.role} role not allowed`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Error in role authorization",
        error: error.message,
      });
    }
  };
};

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  // Split the header to remove "Bearer " prefix
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ error: "Token has expired" });
    }
    return res.status(400).send({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json({ message: "token is not valid" });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "token is not exist" });
  }
};

module.exports = {
  verifyToken,
};

const jwt = require("jsonwebtoken");
const config = require("../config/index");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    try {
      req.token = bearerToken;
      req.user = jwt.verify(
        req.token,
        config.development.JWT_SECRETE_KEY
      )?.user;
      next();
    } catch (e) {
      console.error(e);
      res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
  } else {
    res.sendStatus(403); // forbidden
  }
}

module.exports = verifyToken;

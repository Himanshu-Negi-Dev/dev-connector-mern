const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
   const token = req.header("x-auth-token");

   if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
   }

   try {
      const decode = jwt.verify(token, config.get("jwtSecret"));
      req.user = decode.user;
      next();
   } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: "Token is not valid" });
   }
};

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

router.get("/", auth, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
   } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
   }
});

router.post(
   "/",
   [check("email", "Please Enter a valid email").isEmail(), check("password", "password is required").exists()],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).res.json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      try {
         const user = await User.findOne({ email: email });
         if (!user) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
         }

         let isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
         }

         const payload = {
            user: {
               id: user.id,
            },
         };

         await jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "1d" }, (err, token) => {
            if (err) throw err;
            res.json({ token });
         });
      } catch (error) {
         console.log(error.message);
         res.status(500).send("server error");
      }
   }
);

module.exports = router;

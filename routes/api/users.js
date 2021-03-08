const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/Users");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
   "/",
   [
      check("name", "Name is required!").not().isEmpty(),
      check("email", "Please enter valid email!").isEmail(),
      check("password", "Please enter a password with length 6 or more characters").isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      try {
         let user = await User.findOne({ email: email });
         if (user) {
            return res.status(400).json({ errors: [{ msg: "user already exist!" }] });
         }

         const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
         });

         user = new User({
            name: name,
            email: email,
            avatar: avatar,
            password: password,
         });

         const salt = await bcrypt.genSalt(10);
         user.password = await bcrypt.hash(password, salt);

         await user.save();

         const payload = {
            user: {
               id: user.id,
            },
         };

         jwt.sign(payload, config.get("jwtSecret"), { expiresIn: "1d" }, (err, token) => {
            if (err) throw err;
            res.json({ token });
         });
      } catch (error) {
         console.log(error.message);
         res.status(500).json(error.message);
      }
   }
);

module.exports = router;

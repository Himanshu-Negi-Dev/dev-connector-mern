const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");

router.get("/me", auth, async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
      if (!profile) {
         return res.status(400).json({ msg: "There is no profile for this user" });
      }
      res.json(profile);
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
   }
});

router.post(
   "/",
   [
      auth,
      [check("status", "status is required").not().isEmpty(), check("skills", "skills is required").not().isEmpty()],
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const {
         company,
         website,
         location,
         status,
         skills,
         bio,
         githubusername,
         youtube,
         facebook,
         twitter,
         instagram,
         linkedin,
      } = req.body;

      // Build Profile object
      let profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (status) profileFields.status = status;
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
         profileFields.skills = skills.split(",").map((skill) => skill.trim());
      }

      //Build social object

      profileFields.social = {};

      if (youtube) profileFields.social.youtube = youtube;
      if (facebook) profileFields.social.facebook = facebook;
      if (twitter) profileFields.social.twitter = twitter;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;

      try {
         let profile = await Profile.findOne({ user: req.user.id });

         // console.log(profile);
         if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
            return res.json(profile);
         }

         profile = new Profile(profileFields);
         await profile.save();
         return res.json(profile);
      } catch (error) {
         console.log(error.message);
         res.status(500).send("Server Error");
      }
   }
);

router.get("/", async (req, res) => {
   try {
      const profile = await Profile.find().populate("user", ["name", "avatar"]);
      res.json(profile);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

router.get("/user/:user_id", async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);
      res.json(profile);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});



router.delete("/", auth, async (req, res) => {
   try {
      // remove post

      await Post.deleteMany({ user: req.user.id  });

      //remove profile
      const profile = await Profile.findOneAndRemove({ user: req.user.id });
      //remove user
      const user = await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: "user removed" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

router.put(
   "/experience",
   [
      auth,
      [
         check("title", "Title is required").not().isEmpty(),
         check("company", "company is required").not().isEmpty(),
         check("from", "from is required").not().isEmpty(),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { title, company, location, from, to, current, description } = req.body;
      const newExp = {
         title: title,
         company: company,
         location: location,
         from: from,
         to: to,
         current: current,
         description: description,
      };

      try {
         const profile = await Profile.findOne({ user: req.user.id });
         profile.experience.unshift(newExp);
         await profile.save();
         res.json(profile);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
      }
   }
);

router.delete("/experience/:exp_id", auth, async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.user.id });
      //get index in array
      // const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
      // console.log(removeIndex);

      profile.experience = profile.experience.filter((item) => item._id.toString() !== req.params.exp_id);
      await profile.save();
      return res.json(profile);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//this is for learning purpose

// router.put("/update/experience/:exp_id", auth, async (req, res) => {
//    const { title, company, location, from, to, current, description } = req.body;
//    try {
//       const profile = await Profile.findOne({ user: req.user.id });
//       const updateIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);
//       console.log(updateIndex);
//       const updateExp = {
//          _id: req.params.exp_id,
//          title: title,
//          company: company,
//          location: location,
//          from: from,
//          to: to,
//          current: current,
//          description: description,
//       };
//       profile.experience[updateIndex] = updateExp;
//       await profile.save();
//       res.json(profile);
//    } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//    }
// });

router.put(
   "/education",
   [
      auth,
      [
         check("school", "school is required").not().isEmpty(),
         check("degree", "degree is required").not().isEmpty(),
         check("fieldofstudy", "field of study is required").not().isEmpty(),
         check("from", "from is required").not().isEmpty(),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }

      const { school, degree, fieldofstudy, from, to, current, description } = req.body;
      const newEdu = {
         school: school,
         degree: degree,
         fieldofstudy: fieldofstudy,
         from: from,
         to: to,
         current: current,
         description: description,
      };

      try {
         const profile = await Profile.findOne({ user: req.user.id });
         profile.education.unshift(newEdu);
         await profile.save();
         res.json(profile);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server Error");
      }
   }
);

router.delete("/education/:edu_id", auth, async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education = profile.education.filter((item) => item._id.toString() !== req.params.edu_id);
      await profile.save();
      return res.json(profile);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});
module.exports = router;

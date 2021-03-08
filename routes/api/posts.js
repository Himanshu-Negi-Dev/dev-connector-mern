const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const User = require("../../models/Users");
const Profile = require("../../models/Profile");

router.post("/", [auth, [check("text", "Test is required").not().isEmpty()]], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
         text: req.body.text,
         name: user.name,
         avatar: user.avatar,
         user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
});

router.get("/", auth, async (req, res) => {
   try {
      const post = await Post.find().sort({ date: -1 });
      res.json(post);
   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
});

router.get("/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         return res.status(404).json({ msg: "page not found" });
      }
      res.json(post);
   } catch (err) {
      console.log(err.message);
      if (err.kind === "ObjectId") {
         return res.status(404).json({ msg: "page not found" });
      }
      res.status(500).send("server error");
   }
});


router.delete("/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (!post) {
         return res.status(404).json({ msg: "page not found" });
      }

      if (post.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: "user not authorised" });
      }

      await post.remove();
      res.json({ msg: "post removed" });
   } catch (err) {
      console.log(err.message);
      if (err.kind === "ObjectId") {
         return res.status(404).json({ msg: "page not found" });
      }
      res.status(500).send("server error");
   }
});

router.put("/like/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
         return res.status(400).json({ msg: "post already liked" });
      }

      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
});

router.put("/unlike/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);
      // console.log(post);
      if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
         return res.status(400).json({ msg: "post has not yet been liked" });
      }

      post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
      await post.save();
      res.json(post.likes);
   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
});

router.post("/comments/:id", [auth, [check("text", "Test is required").not().isEmpty()]], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
         text: req.body.text,
         name: user.name,
         avatar: user.avatar,
         user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post);
   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
});

router.put('/comments/:id/:comment_id', auth, async (req,res) => {
   try {
   
      const post = await Post.findById(req.params.id);

      const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

      if(!comment){
         return res.status(404).json({msg: 'comment does not exist'});
      }

      if(comment.user.toString() !== req.user.id){
         return res.status(401).json({msg: 'not authorized'});
      }

      post.comments = post.comments.filter((comment)=>comment.id !== req.params.comment_id);
      await post.save();
      res.json(post.comments);


   } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
   }
})

module.exports = router;

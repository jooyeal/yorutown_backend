const router = require("express").Router();
const { verifyToken } = require("../middlewares/verify");
const Post = require("../models/Post");

//add post
router.post("/add", async (req, res) => {
  const newPost = new Post({ ...req.body });

  try {
    const addedPost = await newPost.save();
    res.status(200).json(addedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update post
router.put("/update/:postId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const targetPost = await Post.findOneAndUpdate(
    {
      userId: userId,
      _id: req.params.postId,
    },
    { $set: { ...req.body } },
    { new: true }
  );
  !targetPost && res.status(400).json({ message: "can not found post" });
  try {
    res.status(200).json(targetPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.delete("/delete/:postId", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const targetPost = await Post.findOneAndDelete({
    userId: userId,
    _id: req.params.postId,
  });
  !targetPost && res.status(400).json({ message: "can not found post" });
  try {
    res.status(200).json(targetPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

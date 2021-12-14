const router = require("express").Router();
const { verifyToken } = require("../middlewares/verify");
const Post = require("../models/Post");

//get post with condition
router.get("/search", async (req, res) => {
  const condition = req.query.condition;
  const key = req.query.key;

  try {
    let posts = null;
    switch (condition) {
      case "categories":
        posts = await Post.find({ categories: key }).sort({ createdAt: -1 });
        break;
      case "title":
        posts = await Post.find({ title: { $regex: key } }).sort({
          createdAt: -1,
        });
        break;
      case "productname":
        posts = await Post.find({ productname: { $regex: key } }).sort({
          createdAt: -1,
        });
        break;
      //price

      //user nickname

      //area
      default:
        posts = { message: "do not exist this condition" };
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

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

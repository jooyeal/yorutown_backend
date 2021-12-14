const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
  const newUser = new User({
    ...req.body,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_KEY
    ).toString(),
  });

  try {
    const registeredUser = await newUser.save();
    res.status(200).json(registeredUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//sign in
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json({ message: "please check again your email" });

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    );

    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json({ message: "please check again your password" });

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    const { password, ...userInfo } = user._doc;
    res.status(200).json({ userInfo, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

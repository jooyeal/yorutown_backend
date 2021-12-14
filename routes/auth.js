const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
  !req.body.lastname &&
    res.status(401).json({ errorMessage: "名字を入力してください" });
  !req.body.firstname &&
    res.status(401).json({ errorMessage: "名前を入力してください" });
  !req.body.nickname &&
    res.status(401).json({ errorMessage: "ニックネームを入力してください" });
  !req.body.email &&
    res.status(401).json({ errorMessage: "メールアドレスを入力してください" });
  !req.body.password &&
    res.status(401).json({ errorMessage: "パスワードを入力してください" });
  !req.body.zipcode &&
    res.status(401).json({ errorMessage: "郵便番号を入力してください" });
  !req.body.city &&
    res.status(401).json({ errorMessage: "市区を入力してください" });
  !req.body.area &&
    res.status(401).json({ errorMessage: "村町を入力してください" });
  !req.body.prefecture &&
    res.status(401).json({ errorMessage: "都道府県を入力してください" });

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
    !user &&
      res.status(401).json({ errorMessage: "please check again your email" });

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_KEY
    );

    const originalPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res
        .status(401)
        .json({ errorMessage: "please check again your password" });

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

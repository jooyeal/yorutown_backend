const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

dotenv.config();

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("DB connection is success"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(process.env.PORT || 8000, () => {
  console.log("server is listening...");
});

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const authRoute = require("./router/auth.js");
const postRoute = require("./router/post.js");
const userRoute = require("./router/user.js");

const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);

// テストAPI
app.get("/", (req, res) => {
  res.send("fuck you");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

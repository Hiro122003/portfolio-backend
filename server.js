const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require('bcrypt');

const PORT = 8080;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("fuck you");
});

// 新規ユーザー登録用API
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword =await bcrypt.hash(password,10)
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password:hashedPassword,
      },
    });
    res.status(200).json({message:"ユーザー登録に成功しました。",user});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

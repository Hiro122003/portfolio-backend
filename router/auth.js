const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const generateIdenticon = require('../utils/generateIdenticon')

const supabase = require("@supabase/supabase-js");
const prisma = new PrismaClient()

// 新規ユーザー登録用API
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const defaultIconImage = generateIdenticon(email) 
  // console.log(defaultIconImage)

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        profile: {
          create: {
            bio: "Nice to meet you",
            profileImageUrl: defaultIconImage
          },
        },
      },
      include:{
        profile:true
      }
    });
    res.status(200).json({ message: "ユーザー登録に成功しました。", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//ユーザーログイン用API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // console.log(user);
  if (!user) {
    res.status(401).json({ message: "新規ユーザー登録してください" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(401).json({ message: "パスワードが間違っています。" });
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  res.status(200).json({ message: "トークンを発行しました。", token });
});

module.exports = router;

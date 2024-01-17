const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

// ユーザー情報の取得　id,email,usernameのみ
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    res.status(200).json({
      message: "ユーザー認証に成功しました。",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "ユーザー認証に失敗しました。", error });
  }
});

// プロフィール情報の取得　profileImageUrl,bio
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      }
    });
    res
      .status(200)
      .json({ message: "プロフィールが見つかりました。", profile });
  } catch (error) {
    res.status(500).json({ error: "プロフィールが見つかりません", error });
  }
});



module.exports = router;

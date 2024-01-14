const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

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

module.exports = router;

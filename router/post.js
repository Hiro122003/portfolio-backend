const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();

const prisma = new PrismaClient();

// 記事投稿登録用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  //   console.log(content)
  if (!content) {
    res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: req.userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.status(200).json({ messasge: "投稿に成功しました。", post });
  } catch (error) {
    res.status(500).json({ error: "投稿に失敗しました。", error });
  }
});

// 全記事取得用API
router.get("/get_latest_post", async (req, res) => {
  try {
    const allPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
            // select: {
            //   bio: true,
            //   profileImageUrl: true
            // }
            // }
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "全データを取得に成功しました。", allPosts });
  } catch (error) {
    res.status(500).json({ error: "データの取得に失敗しました。", error });
  }
});

// 閲覧しているユーザーの投稿内容のみを取得
router.get("/:userId", async (req, res) => {
  const id = req.params.userId;
  console.log(id)
  try {
    const userPost = await prisma.post.findMany({
      where: {
        authorId: Number(id),
      },
      orderBy:{
        createdAt:"desc"
      },
      include:{
        author:true
      }
    });
    res.status(200).json({ message: "ユーザーの投稿内容取得成功", userPost });
  } catch (error) {
    res.status(500).json({error:"ユーザーの投稿内容取得失敗",error})
  }
});

module.exports = router;

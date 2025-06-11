import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  createComment,
  deleteComment,
  editComment,
  getComments,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js"

const router = express.Router()

// Yorum oluştur
router.post("/create", verifyToken, createComment)

// Belirli bir postun yorumlarını getir
router.get("/getPostComments/:postId", getPostComments)

// Yorumu beğen veya beğenmekten vazgeç
router.put("/likeComment/:commentId", verifyToken, likeComment)

// Yorumu düzenle
router.put("/editComment/:commentId", verifyToken, editComment)

// Yorumu sil
router.delete("/deleteComment/:commentId", verifyToken, deleteComment)

// Admin paneli için tüm yorumları getir
router.get("/getcomments", verifyToken, getComments)

export default router

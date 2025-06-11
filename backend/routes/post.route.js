import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  create,
  deletepost,
  getPosts,
  updatepost,
} from "../controllers/post.controller.js"

const router = express.Router()

// Yeni bir post oluştur (Sadece admin)
router.post("/create", verifyToken, create)

// Postları getir (herkes erişebilir)
router.get("/", getPosts)

// Postu sil (admin veya sahip)
router.delete("/:postId/:userId", verifyToken, deletepost)

// Postu güncelle (admin veya sahip)
router.put("/:postId/:userId", verifyToken, updatepost)

export default router

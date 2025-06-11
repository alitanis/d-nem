import Comment from "../models/comment.model.js"
import { errorHandler } from "../utils/error.js"
import mongoose from "mongoose"

// Yorum oluştur
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body

    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to add comment!"))
    }

    if (!content || !postId) {
      return next(errorHandler(400, "All fields are required!"))
    }

    const newComment = new Comment({ content, postId, userId })
    await newComment.save()

    res.status(201).json(newComment)
  } catch (error) {
    next(error)
  }
}

// Belirli bir gönderiye ait yorumları getir
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 })

    res.status(200).json(comments)
  } catch (error) {
    next(error)
  }
}

// Yoruma beğeni ekle / kaldır
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) return next(errorHandler(404, "Comment not found"))

    const userIdStr = String(req.user.id)
    const liked = comment.likes.includes(userIdStr)

    if (liked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userIdStr)
      comment.numberOfLikes -= 1
    } else {
      comment.likes.push(userIdStr)
      comment.numberOfLikes += 1
    }

    await comment.save()
    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

// Yorumu düzenle
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) return next(errorHandler(404, "Comment not found"))

    if (String(comment.userId) !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not authorized to edit this comment!"))
    }

    comment.content = req.body.content || comment.content
    await comment.save()

    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

// Yorumu sil
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) return next(errorHandler(404, "Comment not found"))

    if (String(comment.userId) !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not authorized to delete this comment!"))
    }

    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json("Comment has been deleted successfully!")
  } catch (error) {
    next(error)
  }
}

// Admin paneli için tüm yorumları getir
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to access this resource!"))
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 10
    const sortDirection = req.query.sort === "desc" ? -1 : 1

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username")

    const totalComments = await Comment.countDocuments()

    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({ comments, totalComments, lastMonthComments })
  } catch (error) {
    next(error)
  }
}

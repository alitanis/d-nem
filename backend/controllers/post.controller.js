import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create a post!"))
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fields!"))
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  })

  try {
    const savedPost = await newPost.save()
    res.status(201).json(savedPost)
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0
    const limit = parseInt(req.query.limit) || 9
    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const filters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }

    const posts = await Post.find(filters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalPosts = await Post.countDocuments()
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    })

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    })
  } catch (error) {
    next(error)
  }
}

export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }

    if (!req.user?.isAdmin && req.user.id !== post.userId.toString()) {
      return next(
        errorHandler(403, "You are not authorized to delete this post!")
      )
    }

    await post.deleteOne()
    res.status(200).json("Post has been deleted!")
  } catch (error) {
    next(error)
  }
}

export const updatepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return next(errorHandler(404, "Post not found"))
    }

    if (!req.user?.isAdmin && req.user.id !== post.userId.toString()) {
      return next(
        errorHandler(403, "You are not authorized to update this post!")
      )
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    )

    res.status(200).json(updatedPost)
  } catch (error) {
    next(error)
  }
}

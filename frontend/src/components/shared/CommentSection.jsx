import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const CommentSection = ({ postId }) => {
  const { toast } = useToast()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState("")

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/comment/getPostComments/${postId}`)
      const data = await res.json()
      setComments(data)
    } catch {
      toast({ title: "Failed to load comments." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, postId }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: data.message || "Failed to add comment." })
        return
      }

      setNewComment("")
      fetchComments()
    } catch {
      toast({ title: "Failed to add comment." })
    }
  }

  const handleLike = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      })

      if (res.ok) {
        fetchComments()
      }
    } catch {
      toast({ title: "Failed to like comment." })
    }
  }

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({ title: "Comment deleted." })
        fetchComments()
      }
    } catch {
      toast({ title: "Failed to delete comment." })
    }
  }

  const handleEdit = async (commentId) => {
    try {
      const res = await fetch(`/api/comment/editComment/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      })

      if (res.ok) {
        toast({ title: "Comment updated." })
        setEditingCommentId(null)
        fetchComments()
      }
    } catch {
      toast({ title: "Failed to update comment." })
    }
  }

  return (
    <div className="p-4 mt-6 bg-gray-100 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment}>Post</Button>
      </div>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="mb-4 p-3 border border-gray-300 rounded-md"
          >
            {editingCommentId === comment._id ? (
              <div className="flex flex-col gap-2">
                <Input
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(comment._id)}
                    className="bg-blue-600"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setEditingCommentId(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{comment.content}</p>
                <div className="text-sm text-gray-500 mt-1 flex justify-between items-center">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => handleLike(comment._id)}
                      className="text-blue-600"
                    >
                      ❤️ {comment.numberOfLikes}
                    </button>
                    {(comment.userId === localStorage.getItem("userId") ||
                      localStorage.getItem("isAdmin") === "true") && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id)
                            setEditingContent(comment.content)
                          }}
                          className="text-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default CommentSection

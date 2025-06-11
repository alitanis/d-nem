import React, { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const AdminComments = () => {
  const { toast } = useToast()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [editStates, setEditStates] = useState({}) // id: string
  const [editedContent, setEditedContent] = useState({}) // id: content

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/comment/getcomments")
      const data = await res.json()
      setComments(data.comments)
    } catch (err) {
      toast({ title: "Failed to load comments." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()

      toast({ title: "Comment deleted." })
      fetchComments()
    } catch {
      toast({ title: "Failed to delete comment." })
    }
  }

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/comment/editComment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent[id] }),
      })
      if (!res.ok) throw new Error()

      toast({ title: "Comment updated." })
      setEditStates((prev) => ({ ...prev, [id]: false }))
      fetchComments()
    } catch {
      toast({ title: "Failed to update comment." })
    }
  }

  return (
    <div className="p-4 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">All Comments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="mb-4 p-4 border border-gray-300 rounded"
          >
            {editStates[comment._id] ? (
              <>
                <Textarea
                  value={editedContent[comment._id] || comment.content}
                  onChange={(e) =>
                    setEditedContent((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => handleEdit(comment._id)}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setEditStates((prev) => ({
                        ...prev,
                        [comment._id]: false,
                      }))
                    }
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2">{comment.content}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <span>{comment.numberOfLikes} ❤️</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={() =>
                      setEditStates((prev) => ({ ...prev, [comment._id]: true }))
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default AdminComments

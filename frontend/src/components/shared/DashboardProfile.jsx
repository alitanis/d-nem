import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const DashboardProfile = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch("/api/post/mine", {
          credentials: "include", // eğer oturum çerezine göre çalışıyorsa
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Could not fetch your posts")
        }

        setPosts(data)
      } catch (error) {
        toast({ title: "Error fetching your posts" })
      } finally {
        setLoading(false)
      }
    }

    fetchMyPosts()
  }, [])

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/post/delete/${postId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) {
        toast({ title: "Delete failed" })
        return
      }

      setPosts((prev) => prev.filter((p) => p._id !== postId))
      toast({ title: "Post deleted" })
    } catch {
      toast({ title: "Delete failed" })
    }
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Articles</h1>

      {posts.length === 0 ? (
        <p className="text-center text-slate-500">You have no posts yet.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-slate-500 text-sm">{post.category}</p>
              <div className="flex gap-4 mt-3">
                <Button
                  className="bg-blue-600 text-white"
                  onClick={() => navigate(`/edit-post/${post._id}`)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-600 text-white"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardProfile

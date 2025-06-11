import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/post/getposts?limit=6")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load posts")
      }

      setPosts(data.posts || [])
    } catch (err) {
      toast({ title: "Error loading posts" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <span className="text-gray-500 animate-pulse">Loading posts...</span>
      </div>
    )
  }

  if (!posts.length) {
    return <div className="p-6 text-center">No posts found.</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Latest Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all cursor-pointer"
            onClick={() => navigate(`/post/${post.slug}`)}
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold text-slate-800 line-clamp-2">
                {post.title}
              </h2>

              <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                {post.content
                  ? post.content.replace(/<[^>]+>/g, "").slice(0, 150) + "..."
                  : "No content available"}
              </p>

              <div className="text-xs text-slate-500 mt-4 flex justify-between">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="italic">{post.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

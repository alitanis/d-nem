import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const Home = () => {
  const [posts, setPosts] = useState([])
  const { toast } = useToast()
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/post")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to load posts")
      }

      setPosts(data)
    } catch (err) {
      toast({ title: "Error loading posts" })
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

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
            className="border rounded shadow-md hover:shadow-lg p-4 cursor-pointer"
            onClick={() => navigate(`/post/${post.slug}`)}
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover rounded mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            <p className="text-sm text-slate-600">{post.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

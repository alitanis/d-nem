import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

const SinglePost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/slug/${slug}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Post not found")
        }

        setPost(data)
      } catch (err) {
        toast({ title: "Error fetching post" })
      }
    }

    fetchPost()
  }, [slug])

  if (!post) return <div className="p-6 text-center">Loading...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-slate-500 mb-4">Category: {post.category}</p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-80 object-cover rounded mb-6"
        />
      )}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <div className="flex gap-4 mt-8">
        <Button
          className="bg-blue-600 text-white"
          onClick={() => navigate(`/edit-post/${post._id}`)}
        >
          Edit
        </Button>
        <Button
          className="bg-red-600 text-white"
          onClick={async () => {
            try {
              const res = await fetch(`/api/post/delete/${post._id}`, {
                method: "DELETE",
              })

              if (!res.ok) {
                toast({ title: "Delete failed" })
                return
              }

              toast({ title: "Post deleted" })
              navigate("/")
            } catch {
              toast({ title: "Delete failed" })
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export default SinglePost

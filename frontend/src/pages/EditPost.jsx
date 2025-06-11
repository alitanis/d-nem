import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import React, { useEffect, useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate, useParams } from "react-router-dom"

const EditPost = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [postData, setPostData] = useState(null)
  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [updateError, setUpdateError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/${id}`)
        const data = await res.json()
        setPostData(data)
        setFormData({
          title: data.title,
          category: data.category,
          content: data.content,
          image: data.image,
        })
      } catch (err) {
        console.error(err)
        toast({ title: "Failed to load post data" })
      }
    }

    fetchPost()
  }, [id])

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image!")
        toast({ title: "Please select an image!" })
        return
      }

      setImageUploading(true)
      setImageUploadError(null)

      const formDataImage = new FormData()
      formDataImage.append("image", file)

      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formDataImage,
      })

      const data = await res.json()
      setFormData((prev) => ({ ...prev, image: data.imageUrl }))
      toast({ title: "Image uploaded successfully!" })
    } catch (error) {
      setImageUploadError("Image upload failed")
      toast({ title: "Image upload failed!" })
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/post/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: "Update failed!" })
        setUpdateError(data.message || "Update failed")
        return
      }

      toast({ title: "Article updated successfully!" })
      navigate(`/post/${data.slug}`)
    } catch (err) {
      toast({ title: "Update failed!" })
      setUpdateError("Update failed")
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Edit Post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full sm:w-3/4 h-12 border border-slate-400"
          />

          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="w-full sm:w-1/4 h-12 border border-slate-400">
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="worldnews">World News</SelectItem>
                <SelectItem value="sportsnews">Sports News</SelectItem>
                <SelectItem value="localnews">Local News</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-slate-600 border-dotted p-3">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Button
            type="button"
            className="bg-slate-700"
            onClick={handleUploadImage}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>

        {imageUploadError && <p className="text-red-600">{imageUploadError}</p>}

        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Edit content..."
          className="h-72 mb-12"
          value={formData.content || ""}
          onChange={(value) =>
            setFormData({ ...formData, content: value })
          }
        />

        <Button
          type="submit"
          className="h-12 bg-blue-600 font-semibold text-md"
        >
          Update Post
        </Button>

        {updateError && (
          <p className="text-red-600 mt-5">{updateError}</p>
        )}
      </form>
    </div>
  )
}

export default EditPost

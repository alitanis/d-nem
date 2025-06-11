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

import React, { useState } from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useNavigate } from "react-router-dom"

const CreatePost = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  })
  const [error, setError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)

  const handleImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => reject("Image conversion failed!")
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.category || !formData.content) {
      setError("All fields are required")
      return
    }

    try {
      if (file) {
        setImageUploading(true)
        const base64Image = await handleImageToBase64(file)
        formData.image = base64Image
      }

      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Something went wrong")
        toast({ title: "Post creation failed" })
        return
      }

      toast({ title: "Post created successfully!" })
      navigate(`/post/${data.slug}`)
    } catch (err) {
      setError("Something went wrong. Try again.")
    } finally {
      setImageUploading(false)
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold text-slate-700">
        Create a post
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <Input
            type="text"
            placeholder="Title"
            required
            className="w-full sm:w-3/4 h-12 border border-slate-400"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Select
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

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-green-600">Image ready for upload</p>
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something here..."
          className="h-72 mb-12"
          required
          onChange={(value) =>
            setFormData({ ...formData, content: value })
          }
        />

        <Button
          type="submit"
          className="h-12 bg-green-600 font-semibold text-md"
          disabled={imageUploading}
        >
          {imageUploading ? "Uploading..." : "Publish Your Article"}
        </Button>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  )
}

export default CreatePost

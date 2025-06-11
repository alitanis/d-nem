import PostCard from "@/components/shared/PostCard"
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
import { Separator } from "@/components/ui/separator"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const [filters, setFilters] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  })

  // URL'den filtreleri al
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTerm = urlParams.get("searchTerm") || ""
    const sort = urlParams.get("sort") || "desc"
    const category = urlParams.get("category") || ""

    setFilters({ searchTerm, sort, category })

    fetchPosts(urlParams.toString(), 0)
  }, [location.search])

  const fetchPosts = async (queryString, startIndex = 0) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/post/getposts?${queryString}&startIndex=${startIndex}`)
      const data = await res.json()

      if (res.ok) {
        if (startIndex === 0) {
          setPosts(data.posts)
        } else {
          setPosts((prev) => [...prev, ...data.posts])
        }

        setShowMore(data.posts.length === 9)
      }
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFilters({ ...filters, searchTerm: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const urlParams = new URLSearchParams()
    if (filters.searchTerm) urlParams.set("searchTerm", filters.searchTerm)
    if (filters.sort) urlParams.set("sort", filters.sort)
    if (filters.category) urlParams.set("category", filters.category)

    navigate(`/search?${urlParams.toString()}`)
  }

  const handleShowMore = () => {
    const urlParams = new URLSearchParams(location.search)
    const currentIndex = posts.length
    fetchPosts(urlParams.toString(), currentIndex)
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="p-6 md:w-1/4 bg-white shadow-md border-r border-gray-300">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-semibold text-gray-600">Filters</h2>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">Search Term:</label>
            <Input
              id="searchTerm"
              type="text"
              placeholder="Search..."
              value={filters.searchTerm}
              onChange={handleChange}
              className="border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">Sort By:</label>
            <Select
              value={filters.sort}
              onValueChange={(value) =>
                setFilters({ ...filters, sort: value })
              }
            >
              <SelectTrigger className="w-full border border-slate-400">
                <SelectValue placeholder="Select Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order by:</SelectLabel>
                  <SelectItem value="desc">Latest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-600">Category:</label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-full border border-slate-400">
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

          <Button type="submit" className="bg-red-600 text-white">
            Apply Filters
          </Button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="w-full">
        <h1 className="text-2xl font-semibold text-slate-700 p-3 mt-5">
          News Articles:
        </h1>

        <Separator className="bg-slate-300" />

        <div className="p-7 flex flex-wrap gap-4">
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}

          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-slate-800 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default Search

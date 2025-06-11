import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import DashboardProfile from "./pages/DashboardProfile"
import NewsArticles from "./pages/NewsArticles"
import Header from "./components/shared/Header"
import Footer from "./components/shared/Footer"
import { Toaster } from "./components/ui/toaster"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import SinglePost from "./pages/SinglePost"
import Search from "./pages/Search"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ScrollToTop from "./components/shared/ScrollToTop"
import AdminComments from "./pages/admin/AdminComments" // 👈 BU SATIRI EKLE

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<Search />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<EditPost />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/post/:postSlug" element={<SinglePost />} />
      </Routes>

      <Footer />
      <Toaster />
    </BrowserRouter>
  )
}

export default App

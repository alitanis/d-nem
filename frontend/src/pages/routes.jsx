import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import EditPost from "./pages/EditPost"
import DashboardProfile from "./pages/DashboardProfile"
import SinglePost from "./pages/SinglePost"
import Login from "./pages/Login"
import Register from "./pages/Register"

import Header from "./components/Header"

const AppRoutes = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/dashboard" element={<DashboardProfile />} />
        <Route path="/post/:slug" element={<SinglePost />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes

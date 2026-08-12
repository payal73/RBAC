import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

const Body = () => {
  return (
    <main className="h-screen">
    <Navbar />
    <Outlet />
  </main>
  )
}

export default Body
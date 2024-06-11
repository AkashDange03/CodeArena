import React from "react"
import { Route, Routes } from "react-router-dom"
import Editor from "./pages/Editor"
import Home from "./pages/Home"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </>
  )
}

export default App

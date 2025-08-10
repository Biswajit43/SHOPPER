import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './Component/Navbar/Navbar'
import Admin from './pages/Admin/Admin'
import Footer from './Component/Footer/Footer'


function App() {
  return (
    <>
      <Navbar />
      <Admin />
      <Footer />
    </>
  )
}
export default App

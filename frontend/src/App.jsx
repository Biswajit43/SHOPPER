import { useState } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Shop from './Pages/Shop'
import Cart from './Pages/Cart'
import Product from './Pages/Product'
import Loginsignup from './Components/Popular/Popular'
import Footer from './Components/Footer/Footer'
import Shopcatagory from './Pages/Shopcatagory'
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import Payment from './Pages/Payment'
import Success from './Pages/Success'
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/men' element={<Shopcatagory banner={men_banner} catagory="men" />} />
          <Route path='/women' element={<Shopcatagory banner={women_banner} catagory="women" />} />
          <Route path='/kids' element={<Shopcatagory banner={kid_banner} catagory="kids" />} />
          {/* ✅ Correct route for /product/8 */}
          <Route path='/product/:productid' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Loginsignup />} />
          <Route path='/paymentgateway' element={<Payment />} />
          <Route path="/Success" element={<Success />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}
export default App

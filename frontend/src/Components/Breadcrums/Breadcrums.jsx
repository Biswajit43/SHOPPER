import React from 'react'
import arrow_icon from '../Assets/breadcrum_arrow.png'
import { Link } from 'react-router-dom'

const Breadcrums = ({ product }) => {
    if (!product) return null

    return (
        <div className="flex items-center gap-2 text-gray-700 text-sm font-medium px-4 py-2">
            <Link to={'/'}> <span className="hover:underline cursor-pointer">Home</span> </Link>
            <img src={arrow_icon} alt="arrow" className="w-3 h-3" />
            <Link to={'/'}><span className="hover:underline cursor-pointer">Shop</span></Link>
            <img src={arrow_icon} alt="arrow" className="w-3 h-3" />
            <Link to={`/${product.catagory}`}><span className="capitalize hover:underline cursor-pointer">{product.catagory}</span></Link>
            <img src={arrow_icon} alt="arrow" className="w-3 h-3" />
            <Link to={`/${product.catagory}`}><span className="text-black">{product.name}</span></Link>
        </div>
    )
}
export default Breadcrums

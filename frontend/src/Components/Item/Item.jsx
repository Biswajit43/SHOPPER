import React from 'react'
import { Link } from 'react-router-dom'
const Item = (props) => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 ease-in-out">
            <div className=" overflow-hidden">
                <Link to={`/product/${props.id}`}><img
                    src={props.image}
                    alt={props.name}
                    className="hover:scale-105 transition-transform duration-300"
                /> </Link>
            </div>

            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {props.name}
                </h2>

                <div className="flex items-center gap-3">
                    <span className="text-green-600 font-bold text-base">
                        ₹{props.new_price}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                        ₹{props.old_price}
                    </span>
                </div>
            </div>
        </div >
    )
}

export default Item

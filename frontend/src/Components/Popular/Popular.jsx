import React, { useEffect, useState } from 'react'
import Item from '../Item/Item'

const Popular = () => {
    const [data_product,setdata_product] = useState([])
    useEffect(()=>{
        fetch(`https://shopper-backend-uolh.onrender.com/popularinwomen`)
        .then((res)=>res.json())
        .then((data)=> setdata_product(data));
    },[])
    return (
        <div className='py-10 px-4 md:px-10 bg-white'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center'>
                Popular in Women
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {data_product.map((val, i) => (
                    <Item
                        key={i}
                        id={val.id}
                        name={val.name}
                        image={val.image}
                        new_price={val.new_price}
                        old_price={val.old_price}
                    />
                ))}
            </div>
        </div>
    )
}

export default Popular

import React, { useState } from 'react'
// import new_collections from '../Assets/new_collections'
import { useEffect } from 'react';
import Item from '../Item/Item'
const Newcollection = () => {
    const [new_collections, setnew_collection] = useState([]);
    useEffect(() => {
        fetch(`https://shopper-backend-uolh.onrender.com/new_collections`).then((res) => res.json()).then((data) => setnew_collection(data));
    }, [])
    return (
        <div>
            <h1 className='text-2xl font-extrabold text-gray-800 mb-8 text-center'>New Collections</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {new_collections.map((val, i) => {
                    return <Item
                        key={i}
                        id={i}
                        name={val.name}
                        image={val.image}
                        new_price={val.new_price}
                        old_price={val.old_price}
                    />
                })}
            </div>

        </div>
    )
}
export default Newcollection

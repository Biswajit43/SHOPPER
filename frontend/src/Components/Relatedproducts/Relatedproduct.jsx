import React from 'react'

import Item from '../Item/Item'
import { Shopcontext } from '../../Context/Shopcontext'
import { useContext } from 'react'

const Relatedproduct = () => {
    const {all_product} = useContext(Shopcontext);
    return (
        <div className="px-4 md:px-10 lg:px-20 py-10 bg-gray-50">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
                Related Products
            </h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {all_product.map((val) => (
                    <Item
                        key={val.id}
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

export default Relatedproduct


import React, { useContext } from 'react'
import { Shopcontext } from '../Context/Shopcontext'
import { useParams } from 'react-router-dom'
import Breadcrums from '../Components/Breadcrums/Breadcrums'
import Productdisplay from '../Components/Productdisplay/Productdisplay'
import Relatedproduct from '../Components/Relatedproducts/Relatedproduct'

const Product = () => {
  const { all_product } = useContext(Shopcontext)
  const { productid } = useParams()
  const product = all_product.find((e) => e.id === Number(productid))
  console.log("All Products:", all_product);
  console.log("Looking for Product ID:", productid);

    if (!product) {
    return <div className="text-center text-red-500 py-10">⚠️ Product not found</div>;
  }

  return (
    <div>
      <Breadcrums product={product} />
      <Productdisplay product={product} />
      <Relatedproduct />
    </div>
  )
}

export default Product

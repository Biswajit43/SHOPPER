import React, { useState } from 'react';
import upload_area from '../../assets/upload_area.svg'
const Createproduct = () => {
  const [image, setimage] = useState(false)
  const [productdetails, setproductdetails] = useState({
    name: "",
    image: "",
    catagory: "",
    new_price: "",
    old_price: "",
  })


  const changehandler = (e) => {
    setproductdetails({ ...productdetails, [e.target.name]: e.target.value })
  }
  const imagehandler = (e) => {
    setimage(e.target.files[0])
  }

  const addproduct = async () => {
    console.log(productdetails)
    let response;
    let product = productdetails;
    let formdata = new FormData()
    formdata.append('product', image);
    await fetch(`https://shopper-backend-uolh.onrender.com/upload`, {
      method: 'POST',
      headers: {
        Accept: 'applocation/json'
      },
      body: formdata,
    }).then((res) => res.json()).then((data) => { response = data })
    if (response.success) {
      product.image = response.image_url;
      console.log(product.image)

      //create that product 
      await fetch(`https://shopper-backend-uolh.onrender.com/create_product`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'

        },
        body: JSON.stringify(product),
      }).then((res) => res.json()).then((data) => {
        if (data.success) {
          alert("product added to the server");
        }
        else alert("failed")
      })
    }
  }


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Product</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 text-gray-700">Title:</label>
          <input
            value={productdetails.name} onChange={changehandler}
            name="name"
            type="text"
            placeholder="Enter the product name..."
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">New Price:</label>
          <input
            value={productdetails.new_price} onChange={changehandler}
            name="new_price"
            type="number"
            placeholder="Enter the product new price..."
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Old Price:</label>
          <input
            value={productdetails.old_price} onChange={changehandler}
            name="old_price"
            type="number"
            placeholder="Enter the product old price..."
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Category:</label>
          <select
            value={productdetails.catagory} onChange={changehandler}
            name="catagory"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Image:</label>
          <div className="relative w-35 h-35" >
            <img src={image ? URL.createObjectURL(image) : upload_area} className='w-full h-full object-cover rounded' />
            <input onChange={imagehandler} type='file' name='image' className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer' />
          </div>
        </div>
        <button onClick={addproduct}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Upload Product
        </button>
      </div>
    </div>
  );
};

export default Createproduct;

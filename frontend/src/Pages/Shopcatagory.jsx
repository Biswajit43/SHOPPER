import React, { useContext } from 'react';
import { Shopcontext } from '../Context/Shopcontext';
import Item from '../Components/Item/Item';

const Shopcatagory = (props) => {
  const { all_product } = useContext(Shopcontext);

  // ✅ Log the props and data
  console.log("📦 props.catagory:", props.catagory);
  console.log("📦 all_product:", all_product);

  return (
    <div>
      <img src={props.banner} alt="Category Banner" />
      <div className="flex justify-between p-5">
        <b>showing 1-12 out of 33</b>
        <div className="border  border-gray-500 rounded-full px-2"><b>sort by:</b></div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
        {all_product.map((val, i) => {
   console.log("🧪 Rendering Product →", val.name, "with ID:", val.id);
          if (val.catagory === props.catagory) {
            return (
              <Item
                key={i}
                id={val.id}
                name={val.name}
                image={val.image}
                new_price={val.new_price}
                old_price={val.old_price}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Shopcatagory;

'use client';

import Marquee from "./components/Marquee";
import Menu from "./components/Menu";
import { useState } from "react";
import Image from "next/image";

export default function Index() {

  const [selectedProduct, setSelectedProduct] = useState("Starburst");

  return (
    <>  
      <Marquee>Free Delivery on Campus</Marquee>
      <Menu color="yellow" />
      <div className="w-screen h-screen pt-[6vh] flex flex-col lg:flex-row">
        <div className="lg:w-3/5 h-full flex justify-center items-center bg-theme-green">
          {selectedProduct === "Starburst" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/Starburst.png" width={700}  height={0} />)}
          {selectedProduct === "Hopkins" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/Hopkins.png" width={700}  height={0} />)}
          {selectedProduct === "Mini Grad" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/MiniGrad.png" width={700}  height={0} />)}
        </div>
        <div className="lg:w-2/5 h-full px-10 bg-theme-pink-100">
          <div className="flex flex-col gap-5 lg:pt-28 pt-3 justify-center text-theme-green">
            <h1 className="text-4xl uppercase balgin">Graduation Flowers</h1>
            <p className="text-xl arial hidden lg:block">
              Celebrate graduation with our vibrant bouquet symbolizing success and new beginnings. Bursting with roses, lilies, and daisies, its a perfect gift to mark this milestone.
            </p>
            <div className="uppercase balgin">
              <h3 className="pb-2">Bouquets</h3>
              <div className="w-full flex flex-col border justify-center items-center">
              <button 
                className={`w-full py-4 border-b outline-none text-2xl uppercase ${
                  selectedProduct === "Starburst" 
                  ? "bg-theme-green text-theme-pink-100" 
                  : "bg-white text-theme-green hover:text-theme-pink-200 duration-300"
                }`} 
                onClick={() => {setSelectedProduct("Starburst")}}
              >
                Starburst
              </button>
              <button 
                className={`w-full py-4 border-b outline-none text-2xl uppercase ${
                  selectedProduct === "Hopkins" 
                  ? "bg-theme-green text-theme-pink-100" 
                  : "bg-white text-theme-green hover:text-theme-pink-200 duration-300"
                }`} 
                onClick={() => {setSelectedProduct("Hopkins")}}
              >
                Hopkins
              </button>
              <button 
                className={`w-full py-4 outline-none text-2xl uppercase ${
                  selectedProduct === "Mini Grad" 
                  ? "bg-theme-green text-theme-pink-100" 
                  : "bg-white text-theme-green hover:text-theme-pink-200 duration-300"
                }`} 
                onClick={() => {setSelectedProduct("Mini Grad")}}
              >
                Mini Grad
              </button>
              </div>
            </div>
            <div className="uppercase balgin">
              <div className="w-full flex flex-col border bg-white">
                <p className="py-3 px-14 text-2xl self-start">
                  {selectedProduct === "Starburst" && ("RM 129.00")}
                  {selectedProduct === "Hopkins" && ("RM 89.00")}
                  {selectedProduct === "Mini Grad" && ("RM 59.00")}
                </p>
                <button className="self-center w-4/5 py-4 rounded utline-none text-theme-yellow text-2xl uppercase bg-theme-green">Add To Cart</button>
                <p className="py-3 px-14 text-xs self-start arial">Free Delivery on Campus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

'use client';

import Marquee from "./components/Marquee";
import Menu from "./components/Menu";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

interface ProductProps {
  id: number,
  name: string,
  price: number,
  imageUrl: string,
  quantity: number,
}

const features: ProductProps[] = [
  { id: 1001, name: "Starburst", price: 129, imageUrl: "https://tarumt-ecommerce.s3.amazonaws.com/Features/Starburst.png", quantity: 1 },
  { id: 1002, name: "Hopkins", price: 89, imageUrl: "https://tarumt-ecommerce.s3.amazonaws.com/Features/Hopkins.png", quantity: 2 },
  { id: 1003, name: "Mini Grad", price: 59, imageUrl: "https://tarumt-ecommerce.s3.amazonaws.com/Features/MiniGrad.png", quantity: 3 },
];

export default function Index() {

  const [selectedProduct, setSelectedProduct] = useState("Starburst");

  const [cart, setCart] = useState<ProductProps[]>([]);
  const [menuKey, setMenuKey] = useState(0);
  const [subtotal, setSubtotal] = useState(0.00);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const savedCart = Cookies.get('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const savedSubtotal = Cookies.get('subtotal');
    if (savedSubtotal) {
      setSubtotal(parseFloat(savedSubtotal));
    }
  }, []);

  const updateCart = (newCart: ProductProps[]) => {
    setCart(newCart);
    const newSubtotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const newItemCount = newCart.reduce((acc, item) => acc + item.quantity, 0); // Calculate total item count
    setItemCount(newItemCount);
    setSubtotal(newSubtotal);
    Cookies.set('cart', JSON.stringify(newCart), { expires: 7 });
    Cookies.set('subtotal', newSubtotal.toFixed(2), { expires: 7 });
    Cookies.set('itemCount', newItemCount.toString(), { expires: 7 });
  };

  const addToCart = (product: ProductProps) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      updateCart(updatedCart);
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      updateCart(newCart);
    }
    setMenuKey(prevKey => prevKey + 1);
    location.reload();
  };

  const getProduct = () => {
    return features.find(product => product.name === selectedProduct);
  };

  return (
    <>
      <Marquee>Free Delivery on Campus</Marquee>
      <Menu color="yellow" />
      <div className="w-screen h-screen pt-[6vh] flex flex-col lg:flex-row">
        <div className="lg:w-3/5 h-full flex justify-center items-center bg-theme-green">
          {selectedProduct === "Starburst" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/Starburst.png" width={700} height={0} />)}
          {selectedProduct === "Hopkins" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/Hopkins.png" width={700} height={0} />)}
          {selectedProduct === "Mini Grad" && (<Image alt="" src="https://tarumt-ecommerce-s3.s3.amazonaws.com/Features/MiniGrad.png" width={700} height={0} />)}
        </div>
        <div className="lg:w-2/5 h-full px-10 bg-theme-pink-100">
          <div className="flex flex-col gap-5 lg:pt-28 pt-3 justify-center text-theme-green">
            <h1 className="text-4xl uppercase balgin">Graduation Flowers</h1>
            <p className="text-xl arial hidden lg:block">
              Celebrate graduation with our vibrant bouquet symbolizing success and new beginnings. Bursting with roses, lilies, and daisies, it's a perfect gift to mark this milestone.
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
                  onClick={() => { setSelectedProduct("Starburst") }}
                >
                  Starburst
                </button>
                <button
                  className={`w-full py-4 border-b outline-none text-2xl uppercase ${
                    selectedProduct === "Hopkins"
                      ? "bg-theme-green text-theme-pink-100"
                      : "bg-white text-theme-green hover:text-theme-pink-200 duration-300"
                  }`}
                  onClick={() => { setSelectedProduct("Hopkins") }}
                >
                  Hopkins
                </button>
                <button
                  className={`w-full py-4 outline-none text-2xl uppercase ${
                    selectedProduct === "Mini Grad"
                      ? "bg-theme-green text-theme-pink-100"
                      : "bg-white text-theme-green hover:text-theme-pink-200 duration-300"
                  }`}
                  onClick={() => { setSelectedProduct("Mini Grad") }}
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
                <button className="self-center w-4/5 py-4 rounded outline-none text-theme-yellow text-2xl uppercase bg-theme-green" onClick={() => addToCart(getProduct()!)}>Add To Cart</button>
                <p className="py-3 px-14 text-xs self-start arial">Free Delivery on Campus</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

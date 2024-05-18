'use client';

import Marquee from "@/app/components/Marquee";
import Menu from "@/app/components/Menu";
import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from 'js-cookie';

interface ProductProps {
    id: number,
    name: string,
    price: number,
    imageUrl: string,
    createdAt:  Date,
    updatedAt: Date,
    quantity: number,

}

const Shop = () => {
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
    };

    const [products, setProducts] = useState<ProductProps[]>([]);

    useEffect(() => {
        fetch('/api/product', { method: 'GET'})
          .then(response => response.json())
          .then(data => {
            setProducts(data);
          })
          .catch(error => console.error('Error fetching items:', error));
    }, []);
    
    return (
        <>
            <Marquee>Free Delivery on Campus</Marquee>
            <Menu key={menuKey} color="green"/>
            <div className="flex flex-col items-center gap-6 w-screen min-h-screen pt-20 px-4 lg:pt-32 bg-theme-pink-100">
                <h1 className="text-theme-green text-4xl balgin uppercase">Celebrate Your Success</h1>
                <p className="text-theme-green text-xl arial">Get ready to mark the culmination of your college journey with our exclusive graduation products</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 w-full lg:px-40 pb-6">
                    {products.map((product) => (
                        <div key={product.id} className="h-[60vh] flex justify-center items-center flex-col gap-3">
                            <div className="flex justify-center items-center w-[40vh] h-[40vh] overflow-hidden">
                                <Image  height={0} width={400} alt={product.name} src={product.imageUrl} className="scale-75 hover:scale-90 hover:-rotate-6 duration-500" />
                            </div>
                            <h1 className="text-theme-green text-3xl balgin text-center">{product.name}</h1>
                            <p className="text-theme-green text-xl arial">RM {product.price.toFixed(2)}</p>
                            <button className="outline-none border-2 rounded-md border-theme-green px-6 py-3 text-2xl uppercase balgin text-theme-green hover:text-theme-pink-100 hover:bg-theme-green duration-300" onClick={() => addToCart(product)}>Add To Card</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default Shop;
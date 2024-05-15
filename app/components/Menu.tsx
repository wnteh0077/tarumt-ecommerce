'use clinet';

import gsap from "gsap";
import MenuStar from "./MenuStar";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

interface MenuProps {
    color: "yellow" | "green",
};

interface CartProps {
    name: string,
    price: number,
    imageUrl: string,
};

const Menu: React.FC<MenuProps> = ({ color }) => {
    const router = useRouter();
    const [cart, setCart] = useState<CartProps[]>([])

    const openCart = () => {
        gsap.to(".cart", { right: "0", display: "flex", opacity: 1 });
        gsap.set("body", { overflow: 'hidden' }); 
      };
    
      const closeCart = () => {
        gsap.to(".cart", { right: "-100%", display: "hidden " });
        gsap.set("body", { overflowY: 'auto' }); 
      };

    return (
        <>
            <div className="hidden absolute w-full top-[7vh] lg:flex justify-between items-center px-10">
                <div>
                    <img className="cursor-pointer" src={`${color}-logo.png`} width={100} onClick={() => { router.push("/") }}/>
                </div>
                <div className="flex gap-2">
                    <img className="cursor-pointer scale-50" src="market.png" width={64} onClick={ openCart } />         
                    <MenuStar onClick={() => { router.push("/shop") }} />
                </div>
            </div>

            <div className={`cart gap-6 flex-col absolute w-2/5 h-screen top-0 right-[-40%] px-10 py-12 hidden bg-theme-pink-100 z-50 overflow-hidden border`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-theme-green text-2xl uppercase balgin">Your Cart</h1>
                    <h1 className="text-theme-green text-2xl uppercase balgin cursor-pointer" onClick={ closeCart }>Close</h1>
                </div>
                <div className="h-full flex flex-col overflow-y-auto gap-4">
                    <div className="flex-none h-[30%] bg-white border">
                    </div>
                </div>
                <div className="flex justify-between text-theme-green arial text-xl font-bold">
                    <p>Subtotal</p>
                    <p>RM 0.00</p>
                </div>
                <button className="w-full py-3 text-theme-pink-100 text-2xl uppercase bg-theme-pink-200 balgin rounded-md">Check Out</button>
            </div>
        </>
    )

};

export default Menu;
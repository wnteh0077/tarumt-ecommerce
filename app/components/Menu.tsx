'use client';
import React, { useState, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import MenuStar from "./MenuStar";

interface MenuProps {
    color: "yellow" | "green",
};

interface ProductProps {
    id: number,
    name: string,
    price: number,
    imageUrl: string,
    createdAt?: Date,
    updatedAt?: Date,
    quantity: number, 
}

const Menu: React.FC<MenuProps> = ({ color }) => {
    const router = useRouter();
    const [cart, setCart] = useState<ProductProps[]>([]);
    const [subtotal, setSubtotal] = useState(0.00);
    const [isCartOpen, setIsCartOpen] = useState(false); 
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

    useEffect(() => {
        const savedCount = Cookies.get('itemCount');
        if (savedCount) {
            setItemCount(parseInt(savedCount));
        }
    }, []);

    const openCart = () => {
        setIsCartOpen(true);
        gsap.to(".cart", { right: "0", display: "flex", opacity: 1 });
        gsap.set("body", { overflow: 'hidden' }); 
    };
    
    const closeCart = () => {
        setIsCartOpen(false);
        gsap.to(".cart", { right: "-100%", display: "hidden" });
        gsap.set("body", { overflowY: 'auto' }); 
        location.reload();
    };

    const updateCart = (newCart: ProductProps[]) => {
        setCart(newCart);
        const newSubtotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const newItemCount = newCart.reduce((acc, item) => acc + item.quantity, 0);
        setItemCount(newItemCount);
        setSubtotal(newSubtotal); 
        Cookies.set('cart', JSON.stringify(newCart), { expires: 7 }); 
        Cookies.set('subtotal', newSubtotal.toFixed(2), { expires: 7 }); 
        Cookies.set('itemCount', newItemCount.toString(), { expires: 7 }); 
    };

    const removeFromCart = (productId: number) => {
        const updatedCart = cart.map(product => {
            if (product.id === productId) {
                if (product.quantity > 1) {
                    return { ...product, quantity: product.quantity - 1 };
                } else {
                    return null;
                }
            }
            return product;
        }).filter(Boolean) as ProductProps[]; 
        updateCart(updatedCart);
    };

    const addFromCart = (productId: number) => {
        const updatedCart = cart.map(product => {
            if (product.id === productId) {
                return { ...product, quantity: product.quantity + 1 };
            }
            return product;
        });
        updateCart(updatedCart);
    };

    const handleCheckout = () => {
        Cookies.remove('cart');
        Cookies.remove('subtotal');
        Cookies.remove('itemCount');
        alert("Thank you for your purchase!");
        // You can add additional logic here to redirect to a confirmation page, etc.
        setCart([]);
        setSubtotal(0);
        setItemCount(0);
        closeCart();
    };

    return (
        <>
            <div className="hidden absolute w-full top-[7vh] lg:flex justify-between items-center px-10">
                <div>
                    <Image alt="" className="cursor-pointer" src={`/${color}-logo.png`} width={100} height={0}  onClick={() => { router.push("/") }}/>
                </div>
                <div className="flex gap-2">
                    <Image alt="" className="cursor-pointer scale-50" src="/market.png" width={64} height={0}  onClick={ openCart } />         
                    {itemCount > 0 && (<div className="balgin text-theme-green absolute right-[108px] top-[24px]">{itemCount}</div> )}
                    <MenuStar onClick={() => { router.push("/shop") }} />
                </div>
            </div>

            {/* Cart */}
            <div className={`cart gap-6 flex-col w-2/5 h-screen top-0 fixed right-[-40%] px-10 py-12 hidden bg-theme-pink-100 z-50 overflow-hidden border`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-theme-green text-2xl uppercase balgin">Your Cart</h1>
                    <h1 className="text-theme-green text-2xl uppercase balgin cursor-pointer" onClick={ closeCart }>Close</h1>
                </div>
                {itemCount > 0 ? (
                    <>
                        <div className="h-full flex flex-col overflow-y-auto gap-4">
                            {cart && cart.map(p => (
                                <div className="flex-none grid grid-cols-3 h-[30%] bg-white border" key={p.id}>
                                    <div className="col-span-1 flex justify-center items-center">
                                        <Image src={p.imageUrl} width={72} height={72} alt={p.name} />
                                    </div>
                                    <div className="col-span-2 flex py-8 gap-2 flex-col">
                                        <span className="arial text-theme-green">{p.name}</span>
                                        <div className="w-[30%] flex justify-center items-center gap-6 border">
                                            <span className="cursor-pointer text-sm arial text-theme-green" onClick={() => {removeFromCart(p.id)}}>−</span>
                                            <span className="arial text-theme-green">{p.quantity}</span>
                                            <span className="cursor-pointer arial text-sm text-theme-green" onClick={() => {addFromCart(p.id)}}>＋</span>
                                        </div>
                                        <span className="arial font-bold text-theme-green">RM {(p.quantity * p.price).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-theme-green arial text-xl font-bold">
                            <p>Subtotal</p>
                            <p>RM {subtotal.toFixed(2)}</p>
                        </div>
                        <button className="w-full py-3 text-theme-pink-100 text-2xl uppercase bg-theme-pink-200 balgin rounded-md" onClick={handleCheckout}>Check Out</button>
                    </>
                ) : (
                    <h1 className="w-full h-full balgin flex justify-center items-center text-4xl text-theme-green uppercase">Empty</h1>
                )}
            </div>

            {isCartOpen && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-[#000000] opacity-50 z-40"
                    onClick={closeCart} 
                />
            )}
        </>
    );
};

export default Menu;

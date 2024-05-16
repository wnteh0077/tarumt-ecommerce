'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface ProductProps {
    id: number,
    name: string,
    price: number,
    imageUrl: string,
    createdAt:  Date,
    updatedAt: Date,
}

const Dashboard = () => {

    const [products, setProducts] = useState<ProductProps[]>([]);

    const handleDelete = async (id: number) => {
        
        try {
            await fetch('/api/product', {
                method: 'DELETE',
                body: JSON.stringify({id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            location.reload();

        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }

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
            <div className="min-h-full px-10 bg-theme-green flex flex-col gap-4">
                <div className="balgin font-bold text-theme-yellow text-xs lg:text-3xl py-10 grid grid-cols-10 w-full border-b-2 border-theme-yellow">
                    <h1 className="col-span-3">Name</h1>
                    <h1 className="col-span-1 justify-self-center">Price</h1>
                    <h1 className="col-span-2 justify-self-center">Image</h1>
                    <h1 className="col-span-2 justify-self-center">CreatedAt</h1>
                    <h1 className="col-span-2 justify-self-center"></h1>
                </div>
                {products.map(product => (
                    <div key={product.id} className="text-theme-yellow text-xs lg:text-xl overflow-hidden py-10 grid grid-cols-10 w-full border-b border-theme-yellow arial">
                        <h1 className="col-span-3">{product.name}</h1>
                        <h1 className="col-span-1 justify-self-center">{product.price.toFixed(2)}</h1>
                        <Image alt={product.name} src={`${product.imageUrl}`}  height={0} width={0} className="h-[5vh] col-span-2 justify-self-center" />
                        <h1 className="col-span-2 justify-self-center">{product.createdAt.toString()}</h1>
                        <button className="text-theme-green bg-theme-yellow text-center balgin px-4 py-3 uppercase rounded-md" onClick={() => {handleDelete(product.id)}}>Delete</button>
                    </div>
                ))}

            </div>
        </>
    )
};

export default Dashboard;
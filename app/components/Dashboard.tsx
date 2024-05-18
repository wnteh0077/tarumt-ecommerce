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

    const [add, setAdd] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [imageURL, setimageURL] = useState("");
    const buttonDisabled = !(name.length > 0 && price > 0 && file);
    const [products, setProducts] = useState<ProductProps[]>([]);

    const toggleAdd = () => {
        setAdd(!add);
    }

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            setimageURL(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        if (file) {
            setimageURL(URL.createObjectURL(file));
            formData.append("name", name);
            formData.append("file", file);
            formData.append("contentType", file.type);
            formData.append("price", price.toString());
            try {
                fetch('/api/product', {
                    method: "POST",
                    body: formData,
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    location.reload();

                    return response.json();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            } catch (e) {
                
            }
        }
    };  
    return (
        <>
            {add ? (

                <div className="flex-col add absolute top-0 h-screen w-screen flex bg-theme-pink-100 items-center bg-themem-yellow z-50 ">
                <div className="self-end px-14 py-10 uppercase text-4xl balgin text-theme-green">
                    <span className="cursor-pointer" onClick={toggleAdd}>Close</span>
                </div>
                <form className="flex gap-6 flex-col items-center pt-40 w-full" onSubmit={handleSubmit}>
                    <input className="w-[400px] outline-none border-theme-green b border-2 text-theme-green uppercase bg-theme-pink-100 px-6 py-2 balgin" type="text" placeholder="Name" value={name} onChange={(e) => {setName(e.target.value)}} />
                    <input className="w-[400px] outline-none border-theme-green b border-2 text-theme-green uppercase bg-theme-pink-100 px-6 py-2 balgin" type="number" placeholder="Price" value={price} onChange={(e) => {setPrice(e.target.valueAsNumber)}} />
                    <input type="file" accept="image/jpeg, image/png, image/jpg, image/wbep" onChange={handleFileChange} />                     
                    {imageURL && (
                        <Image alt={name} src={`${imageURL}`} height={30} width={30} />
                    )}
                    <button 
                    className={`balgin text-pink-100 bg-theme-green p-2 w-[400px] rounded-md margin text-theme-pink-100 text-xl ${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                    type="submit" 
                    disabled={buttonDisabled}
                    >
                        Add
                    </button>                
                </form>
            </div>
            ) : (
            <div className="min-h-full px-10 bg-theme-green flex flex-col gap-4 dashboard">
                <div className="balgin font-bold text-theme-yellow text-xs lg:text-3xl py-10 grid grid-cols-8 w-full border-b-2 border-theme-yellow">
                    <h1 className="col-span-3">Name</h1>
                    <h1 className="col-span-1 justify-self-center">Price</h1>
                    <h1 className="col-span-2 justify-self-center">Image</h1>
                    <h1 className="col-span-2 justify-self-center">CreatedAt</h1>
                    <h1 className="col-span-2 justify-self-center"></h1>
                </div>
                {products.map(product => (
                    <div key={product.id} className="text-theme-yellow text-xs lg:text-xl overflow-hidden py-10 grid grid-cols-8 w-full border-b border-theme-yellow arial">
                        <div className="col-span-3 flex items-center gap-5">
                            <h1>{product.name}</h1>
                            <Image alt={product.name} src={product.imageUrl}  height={62} width={48} className="col-span-2 justify-self-center" />
                        </div>
                        <h1 className="col-span-1 justify-self-center self-center">{product.price.toFixed(2)}</h1>
                        <h1 className="col-span-2 justify-self-center self-center">{product.createdAt.toString()}</h1>
                        <button className="col-span-2 text-theme-green bg-theme-yellow self-center text-center balgin px-10 py-2 uppercase rounded-md justify-self-center outline-none" onClick={() => {handleDelete(product.id)}}>Delete</button>
                    </div>
                ))}
                <div className="w-full flex justify-center items-center mt-10 mb-[60px] py-5 rounded-lg text-2xl balgin bg-theme-yellow text-theme-green">
                    <button className="w-full" onClick={toggleAdd}>Add</button>
                </div>
            </div>
            )}
        </>
    )
};

export default Dashboard;
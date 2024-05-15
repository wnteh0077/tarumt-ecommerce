'use client';

import { useState, useEffect } from 'react';

interface ProductProps {
    id: number,
    name: string,
    price: number,
    imageUrl: string,
    createdAt:  Date,
    updatedAt: Date,
}

const ProductForm = () => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [imageURL, setimageURL] = useState("");
    const buttonDisabled = !(name.length > 0 && price > 0 && file);
    const [products, setProducts] = useState<ProductProps[]>([]);

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
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="name" value={name} onChange={(e) => {setName(e.target.value)}} />
                <input type="number" placeholder="price" value={price} onChange={(e) => {setPrice(e.target.valueAsNumber)}} />
                <input type="file" accept="image/jpeg, image/png, image/jpg, image/wbep" onChange={handleFileChange} />
                <button type="submit" disabled={buttonDisabled}>Add</button>
                <img src={imageURL} />
            </form>
            <div>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name}
                        {product.price}
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </li> 
                ))}
            </ul>
            </div>
        </>
    );
};

export default ProductForm;

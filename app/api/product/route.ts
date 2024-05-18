import { PutObjectCommand, GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismadb } from "@/app/lib/db";

const S3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        secretAccessKey: "tSDk9dWGiEV1dUAo/cP3SZKIJs5zP+N6n837InMI",
        accessKeyId: "ASIAZTV654JOSLT2Q5EZ",
        sessionToken: "IQoJb3JpZ2luX2VjEHoaCXVzLXdlc3QtMiJGMEQCIGwBYKo/m3pVO5vI/UUrzu8RLEGApat3knPiWGdUWagYAiAmT0ngFQAsDn5jD7X88WqDJJnHDxroBHO+rjnE7TSGaiqtAgjj//////////8BEAAaDDY2MDc1MTYzOTEzMyIM8q5DBzG+LcIsGwHNKoECFFkLHUbIMkC1H0iWk5uzGen+a2lqEimUI+DIvotSu+ds4SECu4kZ+L/gtAnpiobf3XS1Ys3Brfq+PCCBEKLwzrrcHbgRSLV6bGDkd6OKP5FBZ+NVsV3NMHHVNvFiUXY5Alt7G8iB5e1hWSPa0GbSPUzMP8yBM9fpCEgG/21vpEIXY/vKDLH06ihxdEftI3sIr8TTcreJhOyly3KwsUCHPZmy+Wu/DoAxEnviC1A656e6V7U8HLW6vwaUfI6IzEanFKZ/bFEmqdHtKqzEd6K9W/ANBqQI06e28QmBEYzKLqCMwpZcd6BOszC4Og48nFCxz+vdr6I5nrenxV6wnio55wAwj56gsgY6ngHSOdjibcw1aEVt8x8Bq7+3RKJvzqcDZq5+/Oy8nmpnM7b2L2krPeYKYwqlCZzmguLHmxpr1nSLYRMENJa7ErWLXaE0RveD/yx7wugkXabeG3ra67ynz0Un5r+OEJWHFkHQDAThq3/r9lhQxNp7LvSwGM2prLqltVYJQDjGJIQTypRvYgxUu75+Z5pbxpJc8n2d3Nv8/T1LwFC5e+KRDQ=="
    }
});

const deleteFileFromS3 = async (fileName: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Products/${fileName}.png`,
    };
    const command = new DeleteObjectCommand(params);
    await S3.send(command);
};

const uploadFileToS3 = async (file: Buffer, fileName: string, price: number, contentType: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Products/${fileName}.${contentType}`,
        Body: file,
        ContentType: `image/${contentType}`,
    };
    

    const command = new PutObjectCommand(params);
    await S3.send(command);
    const name = fileName.replace(/ /g, '+');
    await prismadb?.product.create({
        data: {
            name: fileName,
            price,
            imageUrl: `https://tarumt-ecommerce-s3.s3.amazonaws.com/Products/${name}.${contentType}`,
        }
    })

    return {fileName, contentType};
};

const getSignedURL = async (fileName: string, contentType: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Products/${fileName}.${contentType}`,
        Expires: 3600, // 设置 URL 的有效期，单位为秒，这里设置为一小时
        ResponseContentType: "image/jpeg"
    };

    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(S3, command, { expiresIn: 3600 }); // expiresIn 与 Expires 效果相同
    return url;
};

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const products = await prismadb.product.findMany();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: 'Failed to fetch products' });
    }
}
export const POST = async (request: NextRequest) => {
    try {
        const formData = await request.formData();
        const fileInput = formData.get("file") as File;

        if (!fileInput) {
            return NextResponse.json({ error: "No file found in form data."});
        }

        const buffer = Buffer.from(await fileInput.arrayBuffer());
        const fileName = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string); 
        const contentType = (formData.get("contentType") as string).split("/")[1];

        await uploadFileToS3(buffer, fileName, price, contentType);

        const signedUrl = await getSignedURL(fileName, contentType);
        
        return NextResponse.json({ fileName: fileName, success: true, url: signedUrl, price: price, contentType: contentType });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Failed to upload file." });
    }
};

export async function DELETE(req: NextRequest, res: NextResponse) {
    const json = await req.json();
    const id = json.id;
    
    try {
        const product = await prismadb.product.delete({
            where: {
                id,
            },
            select: {
                name: true,
            }
        });

        const { name } = product;

        deleteFileFromS3(name);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}
import { PutObjectCommand, GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismadb } from "@/app/lib/db";

const S3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
});

const deleteFileFromS3 = async (file: Buffer, fileName: string, price: number, contentType: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Products/${fileName}.${contentType}`,
        Body: file,
        ContentType: `image/${contentType}`,
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
            imageUrl: `https://tarumt-ecommerce.s3.amazonaws.com/Products/${name}.${contentType}`,
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
        await prismadb.product.delete({
            where: {
                id,
            },
        });
        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" });
    }
}
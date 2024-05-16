import { PutObjectCommand, GetObjectCommand, S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prismadb } from "@/app/lib/db";

const S3 = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        secretAccessKey: "xl1YsBOUJ/UGBu8KaDeKDbifx0cy4UfnOBNJHnsb",
        accessKeyId: "ASIAZTV654JO2QZQQVD3",
        sessionToken: "IQoJb3JpZ2luX2VjEFkaCXVzLXdlc3QtMiJGMEQCIDZDAF/BXMEuxY2kqvRwoS5lPQb8vbpE2ahw+qZTclgAAiBilOjuHf9SIotkGmQDb492urkq2aNzIzooOhKHYmWERiqtAgjC//////////8BEAAaDDY2MDc1MTYzOTEzMyIMouaMCtkBFBY648pYKoECTCl9hBPvUOQeHmfWG219KhtwDf8fC20YO73L0sF6uWATxfCAUyMbb9auatrD4dIJ6ltB3rrWytN+M52VrCr0Ux/YZVZ6J8yCXJlocaluoBMdQcxdCGR6hlxIlivKXCigf5qq8kClAv7eJLW8ztjR4foK56rb3jzQvvDPPIcCp1gc/SemNITxHirnVosQUghVJ0UXDBYl4kjpNQ75Efi1mdlm2U7TeY/+olVXxup0Bj0ocUdikciP0hof3BNAmMKd8FI3icbHuSwZ5ogYlqUm/hc6Z+P2ep6TY4FTno/4JHyMMn47jBhriH5IhWeG/HonYBVKDuYMQld5thTlq5mDKwIwu/SYsgY6ngGhZYC1q6H7rPpP4BAyXIn1C1rh1atk4yCXFUTxuaSE+6P8vH7QIM2aojVbaLIFnaBtCxejHA6KAHCpc6NjDwgoyVSOXXfGoakz6HQx4w5RLhKq7fErhl4J9ecd5EurBhsuvNALjhuiF/q555agTh2LObTq7c7lFDO39RxL94Mi+l2H5lIQc4T19wqEz70iyAcWEjV8R3I1Ukt+8rERVw=="
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
import { Metadata } from "next";
import './globals.css';
export const metadata: Metadata = {
  title: 'TARUMT Ecommerce',
};


export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <html>
        <body>
          {children}
        </body>
      </html>
    </>
  )
};
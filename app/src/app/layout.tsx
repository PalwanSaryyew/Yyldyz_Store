import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TonProvider from "@/components/ton/TonProvidor";
import Header from "@/components/mains/Header";
import Footer from "@/components/mains/Footer";
import ModalProvider from "@/components/modals/modalDinam/ModalProvider";

const geistSans = localFont({
   /*  src: "@/app/fonts/GeistVF.woff", */
   src: "./fonts/GeistVF.woff",
   variable: "--font-geist-sans",
   weight: "100 900",
});
const geistMono = localFont({
   src: "./fonts/GeistMonoVF.woff",
   variable: "--font-geist-mono",
   weight: "100 900",
});

export const metadata: Metadata = {
   title: "Ýyldyz Store",
   description: "Sanly Dükan",
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
           
            <TonProvider>
               <ModalProvider />
               <Header />
               {children}
               <Footer />
            </TonProvider>
         </body>
      </html>
   );
}

import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Exclusive | Ecommerce App",
  description: "A modern ecommerce application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <AnnouncementBar message="Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!" />
          <ClientNavbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

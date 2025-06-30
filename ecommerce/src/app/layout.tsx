import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ExclusiveIO | Ecommerce App",
  description: "A modern ecommerce application built with Next.js",
  icons: {
    icon: "/images/favicon_io/favicon.ico",
    shortcut: "/images/favicon_io/favicon-16x16.png",
    apple: "/images/favicon_io/apple-touch-icon.png",
  },
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
          <Toaster position="top-center" reverseOrder={false} />
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

// import ClientCleanup from "@/components/ClientCleanup";
import ClientCleanup from "@/components/ClientCleanup";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CIFAR-10 Classifier",
  description: "Image classification demo using a CNN trained on CIFAR-10",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientCleanup />
        {children}
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/navbar";
import AuthWrapper from "@/components/AuthWrapper";
import QueryClientProviderWrapper from "@/components/QueryProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors theme={"light"} />
        <QueryClientProviderWrapper>
          <AuthWrapper>
            <Navbar />
            {children}
          </AuthWrapper>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}

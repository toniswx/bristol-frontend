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
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-geosearch@3.0.0/dist/geosearch.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <Toaster richColors theme={"light"} />
        <QueryClientProviderWrapper>
          <AuthWrapper>
            <Navbar />
            {children}
          </AuthWrapper>
        </QueryClientProviderWrapper>
        <script
          defer
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
        <script
          src="https://unpkg.com/leaflet-geosearch@latest/dist/bundle.min.js"
          defer
        ></script>
      </body>
    </html>
  );
}

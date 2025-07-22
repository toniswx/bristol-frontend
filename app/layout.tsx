import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/navbar";
import AuthWrapper from "@/components/AuthWrapper";
import QueryClientProviderWrapper from "@/components/QueryProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import CustomNavBar from "@/components/customized/navbar-custom";
import Logo from "@/components/custom/logo";
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
            <CustomNavBar />
            {children}
          </AuthWrapper>
        </QueryClientProviderWrapper>

        <footer className="bg-gray-50 mt-10">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex justify-center text-teal-600 sm:justify-start">
                <Logo />
              </div>

              <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right">
                Copyright &copy; 2022. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <script
          defer
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        ></script>
      </body>
      <link
        precedence="default"
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </html>
  );
}

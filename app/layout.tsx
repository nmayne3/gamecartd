import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { Inter, DM_Serif_Display } from "next/font/google";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import { getSession } from "./api/auth/[...nextauth]/auth";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const dm_serif_display = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Gamecartd",
  description: "Get your game on",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en">
      <body className={`${inter.className} ${dm_serif_display.variable}`}>
        <Providers session={session}>
          <div className="h-12 z-50 absolute w-full">
            <Navbar />
          </div>
          {await children}
          <Toaster />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

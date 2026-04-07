import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'SoundNest',
  description: 'Create and share AI-powered podcasts',
  icons: {
    icon: '/icons/logo.png',
    shortcut: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body
        className="min-h-screen bg-background antialiased font-sans"
        suppressHydrationWarning
      >
        <ConvexClerkProvider>
          <AudioProvider>
            {children}
          </AudioProvider>
        </ConvexClerkProvider>
        <Toaster />
      </body>
    </html>
  )
}
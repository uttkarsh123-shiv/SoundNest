import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import AppProvider from "../providers/ConvexProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Toaster } from "sonner";
import AuthModal from "@/components/AuthModal";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",  // prevents layout shift — no swap flash
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "optional",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  weight: ["700", "800"],
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

// Preconnect to speed up font loading
export const viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background antialiased font-sans" suppressHydrationWarning>
        <AppProvider>
          <AudioProvider>
            {children}
            <AuthModal />
          </AudioProvider>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
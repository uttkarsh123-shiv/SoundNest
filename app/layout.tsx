import type { Metadata } from "next";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "PodTales",
  description: "Your World, Your Voice, Anytime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-background antialiased"
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

import LeftSidebar from "@/components/Sidebars/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/Sidebars/RightSidebar/RightSidebar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster"
import PodcastPlayer from "@/components/PodcastPlayers/PodcastPlayer";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col h-screen">
      <main className="relative flex bg-black-3 h-screen overflow-hidden">
        <LeftSidebar />

        <section className="flex flex-1 flex-col px-4 sm:px-8 overflow-y-auto h-[calc(100vh-1px)] custom-scrollbar">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-2">
            <div className="sticky top-0 z-50 flex h-12 items-center justify-between md:hidden bg-black-3/90 backdrop-blur-sm">
              <Link href="/" className="flex cursor-pointer items-center gap-2 group">
                <Image
                  src="/icons/logo.png"
                  width={30}
                  height={30}
                  alt="SoundNest logo"
                  className="transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <h1 className="text-[20px] font-heading font-extrabold bg-gradient-to-r from-green-1 to-white-1 bg-clip-text text-transparent">
                  SoundNest
                </h1>
              </Link>
              <MobileNav />
            </div>
            <div className="flex flex-col flex-1">
              <Toaster />
              <div className="flex-1">
                {children}
              </div>
              <footer className="mt-auto py-8 border-t border-white-1/5">
                <div className="flex items-center justify-center text-white-3 text-sm">
                  <p className="flex items-center gap-1.5">
                    Made with <Heart size={16} className="text-green-1 fill-green-1 animate-pulse" /> by{" "}
                    <a
                      href="https://github.com/uttkarsh123-shiv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-1 hover:text-green-2 hover:underline transition-all duration-200 font-medium"
                    >
                      Uttkarsh Singh
                    </a>
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </section>

        <RightSidebar />
      </main>
      <PodcastPlayer />
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08070a",
};

export const metadata: Metadata = {
  title: "TechMate — Seu parceiro em tech",
  description:
    "Tutoriais, dicas e guias sobre Linux, Windows, desenvolvimento, segurança e gaming. Conteúdo honesto e prático, sem fluff.",
  keywords: [
    "tech",
    "tecnologia",
    "tutoriais",
    "linux",
    "windows",
    "desenvolvimento",
    "programação",
    "gaming",
    "segurança",
    "hardware",
    "open source",
    "tech blog brasil",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allPosts = getAllPosts();

  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <div className="site-backdrop" aria-hidden />

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar allPosts={allPosts} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

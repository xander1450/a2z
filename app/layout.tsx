import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A-Z Tools - All-in-One Multi-Category Utility Hub",
  description: "A free, elegant, open-source utilities and tools repository. Instant JSON Formatters, SQL formatters, QR code generators, EMI calculators, and password tools.",
  keywords: ["A-Z Tools", "free online tools", "developer tools", "JSON formatter", "SQL formatter", "QR Code generator", "EMI calculator", "UUID generator"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning // Suppress hydration warning for theme changes
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-all duration-300 font-sans">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Sidebar />
            <main className="flex-1 min-w-0 py-8 lg:px-8">
              {children}
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

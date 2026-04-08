import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "M60 Recovery & Rescue",
  description: "Instant Manchester recovery quote",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini You AI | Mind Operating System",
  description: "A cinematic AI interface that simulates your mind - past, present, and future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col overflow-hidden">
        {children}
      </body>
    </html>
  );
}

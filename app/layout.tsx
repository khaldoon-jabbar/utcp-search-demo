import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vacation stays",
  description: "Search a short catalog of mock vacation stays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UTCP Search Demo",
  description:
    "A public UTCP manual and mock vacation search API. No account required.",
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

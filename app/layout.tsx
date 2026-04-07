import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Skill Forge",
  description: "Next.js starter with Tailwind CSS and shadcn/ui components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

// fonts
import { customFont, customFont2 } from "@/lib/fonts";
// metadata
import type { Metadata } from "next";
// css
import "./globals.css";
import IMAGES from "@/constants/images";
// metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://MYWEBSITE.COM"),
  title: "The Ultimate Web Dev's Interview Preparation System",
  description:
    "The ULTIMATE Preparation System to Crush Every Web Dev Interview, GUARANTEED. Or Your Money Back.",
  openGraph: {
    images: [
      {
        url: IMAGES.OG_HOME,
        width: 1200,
        height: 630,
        alt: "The Ultimate Web Dev's Interview Preparation System",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${customFont.variable} ${customFont2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

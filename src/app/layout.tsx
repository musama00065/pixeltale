import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PixelTale — AI-Powered Image-to-Story Generator",
  description: "Transform ordinary photos into beautiful, unique stories inspired by colors, mood, and scenery, powered by Gemini 3.5 Flash.",
  openGraph: {
    title: "PixelTale — AI-Powered Image-to-Story Generator",
    description: "Transform ordinary photos into beautiful, unique stories inspired by colors, mood, and scenery.",
    type: "website",
    locale: "en_US",
    siteName: "PixelTale",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelTale — AI-Powered Image-to-Story Generator",
    description: "Transform ordinary photos into beautiful, unique stories inspired by colors, mood, and scenery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerifDisplay.variable} ${merriweather.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cozy-bg text-cozy-slate font-sans selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}

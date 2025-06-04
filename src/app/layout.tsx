import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MdSure 醫學國考題庫",
  description: "MdSure 是一個專為醫學生打造的國考題庫平台，包含歷屆考題與解析。",
  keywords: ["醫學", "國考", "題庫", "MdSure", "醫學生", "二階醫師國考"],
  openGraph: {
    title: "MdSure 醫學國考題庫平台",
    description: "提供高品質醫學考題，幫助你順利通過國考",
    url: "https://taiwan-doctor-examination.netlify.app/contact",
    siteName: "MdSure",
    images: [
      {
        url: "https://www.mdsure.tw/og-image.jpg", // 預覽圖片網址
        width: 1200,
        height: 630,
      },
    ],
    locale: "zh-TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}

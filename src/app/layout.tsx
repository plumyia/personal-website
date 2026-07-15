import type { Metadata } from "next";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - 徐羽佳",
    default: "徐羽佳",
  },
  description:
    "专注品牌活动与内容增长，擅长从0到1打造传播项目。个人作品集网站。",
  icons: {
    icon: "/feather-favicon-384.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Preload feather image before React starts — ensures mobile sees it in time */}
        <link rel="preload" as="image" href="/feather.webp" fetchPriority="high" />
        <script
          dangerouslySetInnerHTML={{
            __html: 'new Image().src="/feather.webp";',
          }}
        />
        {/* Fonts: Playfair Display for hero, Inter for body */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        <CustomCursor />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

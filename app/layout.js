import { IBM_Plex_Sans_Arabic, Lalezar, IBM_Plex_Mono, Poppins, Inter } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import SiteShell from "@/components/layout/SiteShell";
import "./globals.css";

// خطوط العربي
const displayAr = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-display-ar",
  display: "swap",
});

const bodyAr = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-ar",
  display: "swap",
});

// خطوط الإنجليزي — غيّرهم لو عندك اختيار تاني
const displayEn = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-en",
  display: "swap",
});

const bodyEn = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-en",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.the-best-solution.site"), // ✅ الدومين بتاعك
  title: "The Best Solution | حلول تقنية مصممة بدقة",
  description:
    "The Best Solution — شركة حلول تقنية وبرمجية في القاهرة، بنبني أنظمة وتطبيقات مصممة بدقة هندسية لخدمة أهداف عملك.",
  openGraph: {
    title: "The Best Solution | حلول تقنية مصممة بدقة",
    description:
      "The Best Solution — شركة حلول تقنية وبرمجية في القاهرة، بنبني أنظمة وتطبيقات مصممة بدقة هندسية لخدمة أهداف عملك.",
    url: "https://www.the-best-solution.site",
    siteName: "The Best Solution",
    images: [
      {
        url: "/og-image.png", // ⬅️ الصورة اللي هتحطها في مجلد public
        width: 1200,
        height: 630,
        alt: "The Best Solution Logo",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Best Solution | حلول تقنية مصممة بدقة",
    description:
      "The Best Solution — شركة حلول تقنية وبرمجية في القاهرة، بنبني أنظمة وتطبيقات مصممة بدقة هندسية لخدمة أهداف عملك.",
    images: ["/og-image.png"], // ⬅️ نفس الصورة
  },
};

// سكريبت بيشتغل قبل أي رندر عشان يمنع وميض الثيم (FOUC) لما الصفحة تفتح
const themeInitScript = `
(function () {
  try {
    var saved = localStorage.getItem("site-theme");
    var theme = saved === "dark" || saved === "light"
      ? saved
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${displayAr.variable} ${bodyAr.variable} ${displayEn.variable} ${bodyEn.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-bg text-ink font-body antialiased">
        <ThemeProvider defaultTheme="light">
          <LanguageProvider defaultLang="ar">
            <SiteShell>{children}</SiteShell>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
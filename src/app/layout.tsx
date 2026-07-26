import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/LanguageContext";
import { LabAccountProvider } from "@/contexts/LabAccountContext";
import { cn } from "@/lib/utils";
import { siteMetadata } from "@/lib/seo";
import CookieNotice from "@/components/CookieNotice";
import ChatAssistant from "@/components/ChatAssistant";

/** UI chrome + article body */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/** Code, terminal, mono labels */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          jetbrainsMono.variable,
          inter.className,
          "min-h-screen antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LabAccountProvider>
              {children}
              <ChatAssistant />
              <CookieNotice />
            </LabAccountProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

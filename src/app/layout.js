import localFont from "next/font/local";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "PingMaster - Website Monitoring Made Easy",
  description: "Professional URL monitoring service with real-time alerts and detailed analytics",
  keywords: "website monitoring, uptime monitoring, URL monitoring, website uptime, server monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}

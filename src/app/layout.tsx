import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bhuvnesh Singh Kushwah | Backend Engineer",
  description:
    "Backend Engineer specializing in scalable systems, microservices, and cloud infrastructure. Experience with Python, TypeScript, Go, Docker, Kubernetes, and AWS.",
  openGraph: {
    title: "Bhuvnesh Singh Kushwah | Backend Engineer",
    description:
      "Backend Engineer specializing in scalable systems, microservices, and cloud infrastructure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

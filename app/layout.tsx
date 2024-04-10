import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoadingProgressbar } from "@/components/loading-progressbar";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Open Playlist Admin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LoadingProgressbar />
        <ToastProvider />
        <ModalProvider />
        <Toaster />
        {children}
      </body>
    </html>
  );
}

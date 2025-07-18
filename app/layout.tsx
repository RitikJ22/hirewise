import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireWise Co-pilot",
  description: "AI-powered candidate filtering and selection platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-right" richColors closeButton theme="dark" />
      </body>
    </html>
  );
}

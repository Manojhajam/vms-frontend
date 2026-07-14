
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { App as AntdApp } from "antd";
import NotificationInit from "@/lib/api/notification-init";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VMS",
  description: "VMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AntdApp>
            <NotificationInit />
            {children}
          </AntdApp>
        </ThemeProvider>
      </body>
    </html>
  );
}

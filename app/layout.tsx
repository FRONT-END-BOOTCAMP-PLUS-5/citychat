import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import QueryProvider from "./components/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CityChat",
  description: "A city chat application",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <title>Title</title>
      <body>
        <Header />
        <QueryProvider>{children}</QueryProvider>
        <Footer />
      </body>
    </html>
  );
}

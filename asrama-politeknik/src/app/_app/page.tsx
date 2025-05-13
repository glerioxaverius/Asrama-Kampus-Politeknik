import type { AppProps } from "next/app";
import { AuthProvider } from "../context/authContext";
import "./globals.css";

export default function RootLayout({
  Component,
  pageProps,
}: AppProps<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

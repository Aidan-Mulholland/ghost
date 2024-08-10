"use client";
import { Inter as FontSans } from "next/font/google";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "store/store";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-sans)",
    body: "var(--font-sanes)",
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body style={{ minHeight: "100vh" }}>
        <Provider store={store}>
          <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </Provider>
      </body>
    </html>
  );
}

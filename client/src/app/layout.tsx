"use client";
import { Inter as FontSans } from "next/font/google";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

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
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}

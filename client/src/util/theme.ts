import { Theme, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#292828",
        color: "white",
      },
    },
  },
  fonts: {
    heading: "var(--font-sans)",
    body: "var(--font-sanes)",
  },
  colors: {
    background: {
      100: "#3d3a3c",
      500: "#292828",
      900: "#171617",
    },
    highlightRed: "red.600",
    highlightPurple: "purple.600",
  },
  components: {
    Button: {
      variants: {
        primary: {
          color: "white",
          bgColor: "#873154",
          _hover: {
            bgColor: "#842750",
          },
          transition: "0.2s all ease",
        },
      },
    },
  },
});

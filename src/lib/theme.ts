import { createTheme, MantineColorsTuple } from "@mantine/core";

const orange: MantineColorsTuple = [
  "#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c",
  "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12",
];

const dark: MantineColorsTuple = [
  "#C1C2C5", "#A6A7AB", "#909296", "#5C5F66",
  "#373A40", "#2C2E33", "#242424", "#1a1a1a", "#141414", "#0f0f0f",
];

export const theme = createTheme({
  primaryColor: "orange",
  primaryShade: 5,
  colors: { orange, dark },
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), ui-monospace, monospace",
  components: {
    Card: { defaultProps: { withBorder: true } },
    Button: { defaultProps: { radius: "md" } },
    TextInput: { defaultProps: { radius: "md" } },
    NumberInput: { defaultProps: { radius: "md" } },
    PasswordInput: { defaultProps: { radius: "md" } },
  },
});

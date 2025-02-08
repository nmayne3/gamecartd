import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/theme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/tabs.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-serif": ["var(--font-dm-serif)"],
      },
      fontSize: {
        xxs: "0.6rem",
      },
      borderRadius: {
        "sm-md": "0.20rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      outlineWidth: {
        "0.5": "0.5px;",
      },
      boxShadow: {
        "inner-fade": "inset 5px -46px 80px 109px #14181c;",
      },

      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        trimary: "#98AABB",
        "dark-grey": "#2c3440",

        "header-light-grey": "#D8E0E8",
        "discrete-grey": "#9ab",
        "accent-green": "#00C030",
        "accent-green-alt": "#00e054",
        "accent-orange": "#EE7000",
        "menu-primary": "#678",
        background: "var(--background)",
        foreground: "var(--foreground)",
        dropdown: {
          DEFAULT: "var(--dropdown)",
          foreground: "var(--dropdown-foreground)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
    },
  },
  darkMode: ["class", "class"],
  plugins: [nextui(), require("tailwindcss-animate")],
};
export default config;

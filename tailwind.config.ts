import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/theme");



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
        'dm-serif': ['var(--font-dm-serif)'],
      },
      fontSize: {
        'xxs': '0.6rem'
      },
      borderRadius: {
        'sm-md': "0.20rem"
      },
      outlineWidth: {
        '0.5': "0.5px;"
      },
      boxShadow: {
        'inner-fade': "inset 5px -46px 80px 109px #14181c;"
      },
      backgroundImage: {
        'hero': "url('../assets/kindsofkindness.jpg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#14181C',
        secondary: '#445566',
        trimary: '#98AABB',
        'dark-grey': '#2c3440',
        'header-light-grey': '#D8E0E8',
        'discrete-grey': '#9ab',
        'accent-green': '#00C030',
        'accent-green-alt': '#00e054',
        'accent-orange': '#EE7000',
        'menu-primary': '#678'
      }
    },
  },
  darkMode: "class",
  plugins: [nextui(), ],
};
export default config;

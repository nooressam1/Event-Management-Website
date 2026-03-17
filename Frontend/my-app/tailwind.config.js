/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        MainBackground: "#0A0F1D",
        NavigationBackground: "#0F172A",
        LineBox: "#1E293B",
        MainRed: "#F43F5E",
        MainGreenBackgroundLighter: "#0D2731",
        MainBlue: "#1978E5",
        MainGreen: "#34D399",
        MainGreenBackground: "#0B2027",
        MainGreenLine: "#0D4D42",
        MainYellowBackground: "#211E1B",
        MainYellow: "#FBBF24",
        MainYellowLine: "#604416",
        OffRed: "#FB7185",
        OffRedbackground: "#211423",
        OffRedLine: "#602135",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
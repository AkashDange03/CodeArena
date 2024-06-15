/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        PrimaryColor:"#0E1525",
        SecondaryColor:"#1C2333",
        activeColor:"#2B3245",
        ButtonColor:"#0053A6"
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        'golden': '#eab308',
         'silver': '#c0c0c0',

      },
    },
  },
  plugins: [
    daisyui,
  ],daisyui: {
    themes: [ "dark"],
  }
  
}


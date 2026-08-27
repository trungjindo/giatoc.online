/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E6FA8',
          light: '#1C8FD6',
          dark: '#0A5480',
        },
        secondary: {
          DEFAULT: '#F2C46A',
          light: '#F7D890',
          dark: '#D99B26',
        },
        sand: {
          DEFAULT: '#F5E9D6',
          light: '#FBF7EF',
        },
        navy: {
          900: '#163247',
          800: '#1E3A52',
          700: '#2A4D6C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

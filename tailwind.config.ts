/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#7c3aed',
          600: '#6d28d9',
        },
        pink: {
          500: '#ec4899',
        }
      },
      backgroundImage: {
        'gradient-purple-pink': 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
      }
    },
  },
  plugins: [],
}

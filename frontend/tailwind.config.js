/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#4ADE80', // accent
        },
      },
      boxShadow: {
        glow: '0 0 40px rgb(74 222 128 / 0.25)',
      },
    },
  },
  plugins: [],
}

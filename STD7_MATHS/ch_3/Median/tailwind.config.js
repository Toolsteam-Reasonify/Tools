/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f6f8',
          100: '#c0ecf2',
          200: '#99e2e9',
          300: '#73d8e0',
          400: '#22b8cf',
          500: '#15aabf',
          600: '#0f8c9e',
          700: '#0b7285',
        },
        accent: {
          50: '#eef2ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        warning: {
          50: '#fff7ed',
          300: '#fdba74',
          500: '#f97316',
          600: '#ea580c',
        },
      }
    },
  },
  plugins: [],
}








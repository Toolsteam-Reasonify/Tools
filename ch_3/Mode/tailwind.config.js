/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        brand: {
          50: '#e6f6f8',
          100: '#c0ecf2',
          200: '#99e0ea',
          300: '#66d1e1',
          400: '#22b8cf',
          500: '#15aabf',
          600: '#0e9fb3',
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



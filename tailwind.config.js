/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf7f0',
          100: '#fbeee0',
          200: '#f6dcc0',
          300: '#f0c195',
          400: '#e89f68',
          500: '#e28447',
          600: '#d4703c',
          700: '#b05a34',
          800: '#8d4a32',
          900: '#723e2c',
        }
      }
    },
  },
  plugins: [],
};

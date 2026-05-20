/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webviews/**/*.ts', './src/webviews/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fde4e2',
          200: '#fccdca',
          300: '#f9aba6',
          400: '#f57b73',
          500: '#e84b42',
          600: '#d6362f',
          700: '#b42722',
          800: '#95241f',
          900: '#7c2420',
          950: '#430e0c',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          500: '#f59e0b',
          700: '#b45309',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webviews/**/*.ts', './src/webviews/**/*.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c2d8ff',
          300: '#94bdff',
          400: '#5e98ff',
          500: '#3366ff',
          600: '#1a4af0',
          700: '#1238d6',
          800: '#1430ad',
          900: '#152e88',
          950: '#0c1c52',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        sans: ['"SF Pro Display"', '"PingFang SC"', '"Helvetica Neue"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 2px 12px rgba(0,0,0,0.08)',
        'apple-lg': '0 8px 30px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        'apple': '12px',
      },
    },
  },
  plugins: [],
};

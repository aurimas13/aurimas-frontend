/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'lime-25': '#fefffe',
        'yellow-25': '#fffef7',
        'green-25': '#f7fef7',
        'orange-25': '#fffaf5',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  important: false,
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"General Sans"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Editorial Lab Notebook palette
        paper:       '#f4efe6',
        'paper-deep':'#ebe3d4',
        'paper-mute':'#e5dcc9',
        ink: {
          DEFAULT: '#1a1612',
          soft:    '#5a5048',
          mute:    '#8a7f72',
          faint:   '#b8ad9c',
        },
        sulfur:  '#e8b500',
        oxblood: '#7a1f1f',
        teal:    '#0d6a6a',
        moss:    '#4a6741',
        // Legacy aliases kept so existing yellow-* / amber-* classes still resolve to the new palette
        yellow: {
          25:  '#faf5e8',
          50:  '#f7eecf',
          100: '#f1e2a8',
          200: '#ecd47c',
          300: '#e8c34c',
          400: '#e8b500',
          500: '#d4a300',
          600: '#a87f00',
          700: '#7a5c00',
          800: '#5c4500',
          900: '#3d2e00',
        },
      },
      borderRadius: {
        // Override "soft pill" Tailwind defaults — editorial sharp corners
        none: '0',
        sm:   '2px',
        DEFAULT: '2px',
        md:   '2px',
        lg:   '2px',
        xl:   '2px',
        '2xl':'4px',
        '3xl':'4px',
        full: '9999px', // keep round only when explicitly asked (e.g. avatar)
      },
      animation: {
        'rise':    'rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards',
        'fade-in': 'rise 700ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards',
      },
      keyframes: {
        rise: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [],
  important: true,
}

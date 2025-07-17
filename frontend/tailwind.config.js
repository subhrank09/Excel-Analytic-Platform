/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // include all components, pages etc.
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Tailwind Blue-700
        secondary: '#2563EB', // Blue-600
        accent: '#9333EA', // Purple-600
        light: '#F1F5F9', // Slate-100
        dark: '#0F172A', // Slate-900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // modern clean font
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        'slide-up': 'slideUp 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },

        darkMode: 'class',
           content: ["./src/**/*.{js,jsx}"],
           theme: {
           extend: {},
         },
        },
      },
    },
  },
  plugins: [],
};

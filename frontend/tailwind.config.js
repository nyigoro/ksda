/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#ec4899',
        accent: '#f59e0b',
        neutral: '#374151',
        "base-100": '#f3f4f6',
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f97316',
        error: '#ef4444',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

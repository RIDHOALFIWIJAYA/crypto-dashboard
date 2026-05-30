/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'slate-950': '#020617',
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
      }
    },
  },
  plugins: [],
}

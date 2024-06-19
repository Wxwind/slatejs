/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7262FD',
        hover: '#333641',
        bgColorSecondary: '#2A2D37',
      },
    },
  },
  plugins: [],
};

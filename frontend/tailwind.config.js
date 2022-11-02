module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "50": "50%",
        "70": "70%",
        "90": "90%"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

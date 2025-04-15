export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['coiny','Punchliner', 'sans-serif'],
      },
    },
  },
  plugins: [require('flowbite/plugin'),],
}

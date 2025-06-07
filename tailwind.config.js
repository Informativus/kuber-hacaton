/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  // 1) Включаем поддержку dark:class
  darkMode: "class",

  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        // Базовые цвета (light mode)
        background: colors.white,
        card: colors.white,
        input: colors.gray[100],
        ring: colors.blue[500],

        primary: colors.blue[600],
        "primary-foreground": colors.white,

        secondary: colors.gray[200],
        "secondary-foreground": colors.gray[800],

        destructive: colors.red[600],

        accent: colors.gray[50],
        "accent-foreground": colors.gray[700],

        // Для placeholder:text-muted-foreground
        "muted-foreground": colors.gray[400],

        // Граница инпутов
        "border-input": colors.gray[300],

        // Темная тема (dark mode)
        "background-dark": colors.gray[900],
        "card-dark": colors.gray[800],
        "input-dark": colors.gray[700],
        "ring-dark": colors.blue[400],
      },
    },
  },
  plugins: [],
};

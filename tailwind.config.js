/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        card: "var(--color-card)",
        "card-fg": "var(--color-card-fg)",
        secondary: "var(--color-secondary)",
        "secondary-fg": "var(--color-secondary-fg)",
        border: "var(--color-border)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-darker": "var(--color-primary-darker)",
        grid: "var(--color-grid)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
      },
    },
  },
  plugins: [],
};

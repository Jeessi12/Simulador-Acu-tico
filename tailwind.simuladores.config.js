/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/simuladores-showcase.tsx",
    "./src/components/ui/classroom-role-hero.tsx",
    "./src/components/ui/simulation-showcase.tsx",
    "./src/components/ui/button.tsx",
    "./src/components/ui/card.tsx",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [],
};

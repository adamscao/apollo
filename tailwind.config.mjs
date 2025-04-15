
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F4E79',
        secondary: '#FFC000',
        accent: '#4472C4',
        light: '#F2F2F2',
        dark: '#333333',
      },
    },
  },
  plugins: [],
}

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; //Tailwind v4

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() //Activamos el compilador nativo de Tailwind v4
  ],
})

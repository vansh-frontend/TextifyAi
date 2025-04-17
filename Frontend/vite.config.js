import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Ensure this is correctly installed and imported

export default defineConfig({
  plugins: [react(), tailwindcss()],
})

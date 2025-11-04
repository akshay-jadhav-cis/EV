import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server:{
    port:2000,
    "/all":{
      target:"http://localhost:1000/batteries/all",
      crossOrigin:true,
      secure:false
    }
  }
})

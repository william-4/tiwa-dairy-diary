import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      '37433696fb18.ngrok-free.app', // your ngrok hostname
    ],
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Add more chunks for better performance
          router: ['react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          supabase: ['@supabase/supabase-js', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Optimize for Bun
    target: 'esnext',
    minify: 'terser',
  },
  // Add esbuild optimizations for Bun
  esbuild: {
    target: 'esnext',
    platform: 'browser',
  },
  // Optimize deps for Bun
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js'
    ],
  },
}));
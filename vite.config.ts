import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8888,
    hmr: { overlay: false },
    watch: { usePolling: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist/app", // ✅ keeps landing page index.html untouched
    target: "esnext",
    minify: "esbuild", // faster than terser in most cases
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          router: ["react-router-dom"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          supabase: ["@supabase/supabase-js", "@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    target: "esnext",
    platform: "browser",
    drop: ["console", "debugger"], // ✅ smaller + faster
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
    ],
  },
}));

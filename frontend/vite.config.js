import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    // The tubes-cursor build is a single self-contained ESM file (no bare
    // imports), dynamically imported the first time a tubes section nears the
    // viewport. Don't prebundle it: discovering it mid-session triggers Vite's
    // "new dependency optimized → full page reload", which in dev kicked you
    // back to the top of the page right as the effect was about to appear.
    exclude: ['threejs-components'],
  },
  build: {
    // three.js is large by nature; split heavy libraries into their own
    // long-lived, cacheable chunks rather than one monolith. The combined
    // three + R3F vendor chunk is ~1.1MB (≈330KB gzip) and unavoidable for a
    // 3D app — it's cached and sits behind the preloader, and runtime FPS is
    // governed by the adaptive DPR/quality, not bundle size. Limit raised so
    // the (advisory) size warning reflects that reality rather than noise.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          // The neon-tubes payoff effect ships its OWN self-contained three; keep
          // it out of the app's three/r3f chunks so it stays a lazy, on-demand
          // chunk (loaded only when the payoff section is reached on desktop).
          if (id.includes('threejs-components')) return
          if (id.includes('@react-three') || id.includes('postprocessing')) return 'r3f'
          if (id.includes('three')) return 'three' // three, three-stdlib, three-mesh-bvh
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'react'
        },
      },
    },
  },
})

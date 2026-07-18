// vite.config.js
import { defineConfig } from "file:///sessions/zen-vibrant-franklin/mnt/Website/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/zen-vibrant-franklin/mnt/Website/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  build: {
    target: "es2018",
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /* split heavy vendors so the browser downloads them in parallel
           and caches them independently of app-code changes */
        manualChunks: {
          three: ["three"],
          motion: ["framer-motion"],
          scroll: ["gsap", "lenis"],
          react: ["react", "react-dom"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvemVuLXZpYnJhbnQtZnJhbmtsaW4vbW50L1dlYnNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy96ZW4tdmlicmFudC1mcmFua2xpbi9tbnQvV2Vic2l0ZS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvemVuLXZpYnJhbnQtZnJhbmtsaW4vbW50L1dlYnNpdGUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDE4JyxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDcwMCxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLyogc3BsaXQgaGVhdnkgdmVuZG9ycyBzbyB0aGUgYnJvd3NlciBkb3dubG9hZHMgdGhlbSBpbiBwYXJhbGxlbFxuICAgICAgICAgICBhbmQgY2FjaGVzIHRoZW0gaW5kZXBlbmRlbnRseSBvZiBhcHAtY29kZSBjaGFuZ2VzICovXG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHRocmVlOiBbJ3RocmVlJ10sXG4gICAgICAgICAgbW90aW9uOiBbJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgICBzY3JvbGw6IFsnZ3NhcCcsICdsZW5pcyddLFxuICAgICAgICAgIHJlYWN0OiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1QsU0FBUyxvQkFBb0I7QUFDN1UsT0FBTyxXQUFXO0FBRWxCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUix1QkFBdUI7QUFBQSxJQUN2QixlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUE7QUFBQTtBQUFBLFFBR04sY0FBYztBQUFBLFVBQ1osT0FBTyxDQUFDLE9BQU87QUFBQSxVQUNmLFFBQVEsQ0FBQyxlQUFlO0FBQUEsVUFDeEIsUUFBUSxDQUFDLFFBQVEsT0FBTztBQUFBLFVBQ3hCLE9BQU8sQ0FBQyxTQUFTLFdBQVc7QUFBQSxRQUM5QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

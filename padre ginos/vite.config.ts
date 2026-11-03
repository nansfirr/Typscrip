// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// import { defineConfig } from "vitest/config";

// export default defineConfig({
//     server: {
//         proxy: {
//             "/api": {
//                 target: "http://localhost:3000",
//                 changeOrigin: true,
//             },
//             "/public": {
//                 target: "http://localhost:3000",
//                 changeOrigin: true
//             }
//         }
//     },
//     plugins: [TanStackRouterVite(), react()],

//     // test: {
//     //     environment: "happy-dom",

//     //     // inside the test object
//     //     coverage: {
//     //         reporter: ["text", "json", "html"],
//     //     },
//     // },
// });


import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
    ],
  },

  test: {
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [TanStackRouterVite(), react(), tailwindcss()],
});
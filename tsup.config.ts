import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: ["esnext"],
  platform: "node",
  outDir: "dist",
  bundle: true,
  clean: true,
  banner: {
    js: /* ts */ `
   import { createRequire } from 'module';
   const require = createRequire(import.meta.url);
    `,
  },
});

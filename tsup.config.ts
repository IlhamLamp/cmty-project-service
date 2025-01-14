import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  minify: !options.watch,
  entry: ["src/core/index.ts"],
  splitting: !!options.watch,
  onSuccess: options.watch ? "node dist" : undefined,
  clean: true,
  sourcemap: options.watch ? true : undefined,
}));

import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/types/index.ts",
    "src/types/dto/index.ts",
    "src/types/models/index.ts",
    "src/types/flow/index.ts",
    "src/utils/index.ts",
  ],
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  clean: true,
});

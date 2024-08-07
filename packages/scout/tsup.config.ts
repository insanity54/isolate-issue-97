import { defineConfig } from "tsup";
import { exec } from 'child_process';

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",
  clean: true,
  sourcemap: true,
  /**
   * The common package is using the internal packages approach, so it needs to
   * be transpiled / bundled together with the deployed code.
   */
  // noExternal: ["@futurenet/temporal-workflows"],
  /**
   * We do not use tsup for generating d.ts files because it can not generate type
   * the definition maps required for go-to-definition to work in our IDE. We
   * use tsc for that.
   */
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly');
  },
});
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  input: ["./main.ts", "./index.ts"],
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [typescript(), nodeResolve(), commonjs()],
});

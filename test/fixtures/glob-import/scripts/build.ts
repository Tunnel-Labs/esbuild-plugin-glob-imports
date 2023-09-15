import globImportsPlugin from "../../../../src/index.js";
import { getMonorepoDirpath } from "get-monorepo-root";
import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["../src/index.ts"],
  outdir: "../dist",
  plugins: [
    globImportsPlugin({ monorepoDirpath: getMonorepoDirpath(__dirname) }),
  ],
});

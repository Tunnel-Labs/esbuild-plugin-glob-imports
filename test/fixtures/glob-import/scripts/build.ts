import globImportsPlugin from "../../../../src/index.js";
import { getMonorepoDirpath } from "get-monorepo-root";
import Bun from "bun";

Bun.build({
  entrypoints: ["../src/index.ts"],
  outdir: "../dist",
  plugins: [
    globImportsPlugin({ monorepoDirpath: getMonorepoDirpath(__dirname) }),
  ],
});

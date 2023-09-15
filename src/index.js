import { createGlobfileManager } from "glob-imports";

/** @type {import('esbuild').esbuildPlugin} */
export default function globImportsPlugin({ monorepoDirpath }) {
  const { getGlobfileContents, getGlobfilePath } = createGlobfileManager({
    monorepoDirpath,
  });

  return {
    name: "esbuild-plugin-glob-imports",
    setup(build) {
      build.onResolve({ filter: /^glob(?:\[[^\]]+])?:/ }, (args) => {
        const globfilePath = getGlobfilePath({
          globfileModuleSpecifier: args.path,
          importerFilepath: args.importer,
        });

        return {
          path: globfilePath,
          namespace: "glob-imports",
        };
      });

      build.onLoad(
        { filter: /\/__virtual__:.*$/, namespace: "glob-imports" },
        (args) => {
          const globfileContents = getGlobfileContents({
            globfilePath: args.path,
            filepathType: "relative",
          });

          return {
            contents: globfileContents,
            loader: args.loader,
          };
        }
      );
    },
  };
}

import { createGlobfileManager } from "glob-imports";
import { getMonorepoDirpath } from "get-monorepo-root";

/** @type {import('bun').BunPlugin} */
const globfilePlugin = {
  name: "bun-plugin-glob-imports",
  setup(build) {
    const monorepoDirpath = getMonorepoDirpath(__dirname);
    if (monorepoDirpath === undefined) {
      throw new Error("Could not get monorepo dirpath");
    }

    const { getGlobfileContents, getGlobfilePath } = createGlobfileManager({
      monorepoDirpath,
    });

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
          // Parcel does not support absolute filepath imports
          filepathType: "relative",
        });

        console.log(globfileContents);

        return {
          contents: globfileContents,
          loader: args.loader,
        };
      }
    );
  },
};

export default globfilePlugin;

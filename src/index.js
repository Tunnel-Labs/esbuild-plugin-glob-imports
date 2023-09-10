import { createGlobfileManager, isGlobSpecifier } from "glob-imports";
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

    build.onResolve({ filter: /^glob(?:\[[^\]]+])?:/ }, (args) => ({
      path: args.path,
      namespace: "glob-imports",
    }));

    build.onLoad(
      { filter: /^glob(?:\[[^\]]+])?:/, namespace: "glob-imports" },
      () => {
        const globfilePath = getGlobfilePath({
          globfileModuleSpecifier: specifier,
          importerFilepath: dependency.resolveFrom,
        });
        const globfileContents = getGlobfileContents({
          globfilePath,
          // Parcel does not support absolute filepath imports
          filepathType: "relative",
        });

        return {
          contents: globfileContents,
          loader: "js",
        };
      }
    );
  },
};

export default globfilePlugin;

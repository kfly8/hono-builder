import { $ } from "bun";
import { displayResult } from './utils'

const commonOptions = {
  entrypoints: ["./src/index.ts"],
  target: "node" as const,
  minify: false,
  sourceMap: "external",
  external: ["hono"],
}

const esmBuild = async () => {
  const startTime = performance.now();
  const result = await Bun.build({
    ...commonOptions,
    outdir: "./dist",
    format: "esm",
    naming: "[dir]/[name].js",
  })
  const endTime = performance.now();
  const buildTime = endTime - startTime;

  displayResult(result, { buildTime });
}

const cjsBuild = async () => {
  const startTime = performance.now();
  const result = await Bun.build({
    ...commonOptions,
    outdir: "./dist/cjs",
    format: "cjs",
    naming: "[dir]/[name].js",
  })
  const endTime = performance.now();
  const buildTime = endTime - startTime;

  displayResult(result, { buildTime });
}

async function build() {
  try {
    console.log("Starting build process...");
    await Promise.all([ esmBuild(), cjsBuild() ]);

    console.log("Generating type definitions...");
    await $`tsc --project ./tsconfig.build.json`;

    // Copy all .d.ts files from ./dist to ./dist/cjs and rename to .d.cts
    const glob = new Bun.Glob("*.d.ts");
    for await (const file of glob.scan("./dist")) {
      const baseName = file.replace(/\.d\.ts$/, "");
      const sourceFile = `./dist/${file}`;
      const targetFile = `./dist/cjs/${baseName}.d.cts`;
      await Bun.write(targetFile, await Bun.file(sourceFile).text());
    }

    const packageJson = { type: "commonjs" };
    await Bun.write("./dist/cjs/package.json", JSON.stringify(packageJson, null, 2));

    console.log("Build successful!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();

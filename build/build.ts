import { $ } from "bun";

const commonOptions = {
  entrypoints: ["./src/index.ts"],
  target: "node" as const,
  minify: false,
  sourceMap: "external",
  external: ["hono"],
}

async function build() {
  console.log("🚀 Building hono-builder...");

  try {
    console.log("📁 Cleaning dist directory...");
    await $`rm -rf ./dist`;

    console.log("📦 Building ESM bundle...");
    await Bun.build({
      ...commonOptions,
      outdir: "./dist",
      format: "esm",
      naming: "[dir]/[name].js",
    });

    console.log("📦 Building CommonJS bundle...");
    await Bun.build({
      ...commonOptions,
      outdir: "./dist/cjs",
      format: "cjs",
      naming: "[dir]/[name].js",
    });

    console.log("📝 Generating TypeScript declarations...");
    await $`tsc --project ./tsconfig.build.json`;

    console.log("📝 Copying .d.ts files to cjs directory...");
    // Copy all .d.ts files from ./dist to ./dist/cjs and rename to .d.cts
    const glob = new Bun.Glob("*.d.ts");
    for await (const file of glob.scan("./dist")) {
      const baseName = file.replace(/\.d\.ts$/, "");
      const sourceFile = `./dist/${file}`;
      const targetFile = `./dist/cjs/${baseName}.d.cts`;
      await Bun.write(targetFile, await Bun.file(sourceFile).text());
    }

    console.log("📄 Creating package.json for commonjs... ")
    const packageJson = {
      type: "commonjs",
    };

    await Bun.write("./dist/cjs/package.json", JSON.stringify(packageJson, null, 2));

    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();

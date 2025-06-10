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
      outdir: "./dist",
      format: "cjs",
      naming: "[dir]/[name].cjs",
    });

    console.log("📝 Generating TypeScript declarations...");
    await $`tsc \
      --project ./tsconfig.build.json \
      --declaration \
      --emitDeclarationOnly \
      --outDir ./dist \
    `;

    console.log("📄 Creating package.json for dist...");
    const packageJson = {
      name: "hono-builder",
      main: "./index.cjs",
      module: "./index.js",
      types: "./index.d.ts",
      type: "module",
      exports: {
        ".": {
          types: "./index.d.ts",
          import: "./index.js",
          require: "./index.cjs"
        }
      },
      peerDependencies: {
        hono: "^4.0.0"
      }
    };

    await Bun.write("./dist/package.json", JSON.stringify(packageJson, null, 2));

    console.log("✅ Build completed successfully!");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();

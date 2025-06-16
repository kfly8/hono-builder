
const DEFAULT_MAX_DISPLAY_FILES = 30;
const DEFAULT_SIZE_DECIMAL_PLACES = 1;

interface Options {
  maxDisplayFiles?: number;
  fileSizeDecimalPlaces?: number;
}

/**
 * Run build promise with display of output files and build time.
 *
 * @param buildPromise - The promise returned by Bun.build()
 * @param options - Optional configuration for display
 *
 * @example
 * ```ts
 * import { run } from './utils';
 *
 * const buildPromise = Bun.build({
 *   entrypoints: ['./src/index.ts'],
 *   outdir: './dist',
 *   format: 'esm',
 * })
 *
 * run(buildPromise, { maxDisplayFiles: 20, fileSizeDecimalPlaces: 2 });
 * ```
 */
export async function run(buildPromise: Promise<Bun.BuildOutput>, options: Options = {}) {
  const startTime = performance.now()
  const result = await buildPromise
  const endTime = performance.now()
  const buildTime = endTime - startTime

  if (result.success === false) {
    throw new Error('Failed to build')
  }

  const files = result.outputs.map(output => Bun.file(output.path))
  console.log( displayFiles(files, options) );
  console.log( displayBuildTime(buildTime) );
}

// Display the output files in a human-readable format
function displayFiles(files: Bun.BunFile[], options: Options) {
  const sortedFiles = files.sort((a, b) => b.size - a.size);

  const result: string[] = [];

  if (sortedFiles.length > 0) {
    // Display up to maxDisplayFiles
    const maxDisplayFiles = options.maxDisplayFiles ?? DEFAULT_MAX_DISPLAY_FILES;
    const filesToShow = sortedFiles.slice(0, maxDisplayFiles);

    // Calculate the maximum display width for alignment
    const fileNames = filesToShow.map(file => displayFileName(file));
    const maxDisplayFilesWidth = Math.max(...fileNames.map(name => getDisplayWidth(name)));

    for (let i = 0; i < filesToShow.length; i++) {
      const file = filesToShow[i];
      const fileName = fileNames[i];
      const fileSize = displayFileSize(file, options);
      const padding = ' '.repeat(maxDisplayFilesWidth - getDisplayWidth(fileName));
      result.push(`  ${fileName}${padding} ${fileSize}`);
    }

    // Show remaining file count
    const remainingCount = sortedFiles.length - maxDisplayFiles;
    if (remainingCount > 0) {
      result.push(`..and ${remainingCount} more output files...`);
    }
  }

  return result.join('\n')
}

// Display the build time in a human-readable format
function displayBuildTime(buildTime: number) {
  const formattedTime = buildTime < 1000
    ? `${buildTime.toFixed(1)}ms`
    : `${(buildTime / 1000).toFixed(2)}s`;

  return `⚡ \x1b[32mDone in ${formattedTime}\x1b[0m\n`;
}

// Display the file size in a human-readable format
// e.g. "123.4 KB"
function displayFileSize(file: Bun.BunFile, options: Pick<Options, 'fileSizeDecimalPlaces'>) {
  const decimalPlaces = options.fileSizeDecimalPlaces ?? DEFAULT_SIZE_DECIMAL_PLACES;

  const hrSize      = `${(file.size / 1024).toFixed(decimalPlaces)} KB`;
  const coloredSize = `\x1b[36m${hrSize.padStart(8)}\x1b[0m`;
  return coloredSize;
}

// Display the file name in a human-readable format
// e.g. "/path/to/dist/file.js" -> "dist/*file.js*"
function displayFileName(file: Bun.BunFile): string {
  if (file.name === undefined) {
    // Something went wrong, file.name should not be undefined when building
    throw new Error('File name is undefined');
  }

  // convert file.name to a relative path
  const currentDir = process.cwd();
  const relativePath = file.name.startsWith(currentDir + '/')
    ? file.name.slice(currentDir.length + 1)
    : file.name;

  // Extract directory and filename
  const pathParts = relativePath.split('/');
  const filename = pathParts.pop() || relativePath;
  const directory = pathParts.length > 0 ? pathParts.join('/') + '/' : '';

  // Make filename bold
  const boldFilename = `\x1b[1m${filename}\x1b[0m`;
  const displayFileName = directory + boldFilename;

  return displayFileName
}

// Calculate the actual display width of a string, excluding ANSI escape sequences
function getDisplayWidth(str: string): number {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}


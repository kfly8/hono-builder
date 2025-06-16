
interface DisplayOptions {
  maxDisplay?: number;
  sizeDecimalPlaces?: number;
  buildTime?: number;
}

const DEFAULT_MAX_DISPLAY = 30;
const DEFAULT_SIZE_DECIMAL_PLACES = 1;

/**
 * Display the result of a Bun build process in a human-readable format.
 */
export function displayResult(result: Bun.BuildOutput, options: DisplayOptions = {}) {
  if (result.success === false) {
    throw new Error('Failed to build')
  }

  const files = result.outputs.map(output => Bun.file(output.path));
  displayFiles(files, options);
  displaySummary(options);
}

// Display the files in a sorted and formatted manner
function displayFiles(files: Bun.BunFile[], options: DisplayOptions) {
  const sortedFiles = files.sort((a, b) => b.size - a.size);
  const maxDisplay = options.maxDisplay ?? DEFAULT_MAX_DISPLAY;

  if (sortedFiles.length > 0) {
    // Display up to maxDisplay
    const filesToShow = sortedFiles.slice(0, maxDisplay);

    // Calculate the maximum display width for alignment
    const fileNames = filesToShow.map(file => formatFileName(file));
    const maxDisplayWidth = Math.max(...fileNames.map(name => getDisplayWidth(name)));

    for (let i = 0; i < filesToShow.length; i++) {
      const file = filesToShow[i];
      const fileName = fileNames[i];
      const fileSize = formatFileSize(file, options);
      const padding = ' '.repeat(maxDisplayWidth - getDisplayWidth(fileName));
      console.log(`  ${fileName}${padding} ${fileSize}`)
    }

    // Show remaining file count
    const remainingCount = sortedFiles.length - maxDisplay;
    if (remainingCount > 0) {
      console.log(`..and ${remainingCount} more output files...`);
    }
  }
}

// Summary of the build process
function displaySummary(options: DisplayOptions) {

  if (options.buildTime !== undefined) {
    const formattedTime = options.buildTime < 1000
      ? `${options.buildTime.toFixed(1)}ms`
      : `${(options.buildTime / 1000).toFixed(2)}s`;
    console.log(`⚡ \x1b[32mDone in ${formattedTime}\x1b[0m\n`);
  }
  else {
    console.log("⚡ \x1b[32mDone\x1b[0m\n");
  }
}


// Format the file size in a human-readable format
// e.g. "123.4 KB"
function formatFileSize(file: Bun.BunFile, options: DisplayOptions) {
  const kb = file.size / 1024;
  const decimalPlaces = options.sizeDecimalPlaces ?? DEFAULT_SIZE_DECIMAL_PLACES;
  const humanReadableSize        = `${kb.toFixed(decimalPlaces)} KB`;
  const coloredHumanReadableSize = `\x1b[36m${humanReadableSize.padStart(8)}\x1b[0m`;

  return coloredHumanReadableSize;
}

// Format the file name to be displayed in a human-readable format
// e.g. "/path/to/dist/file.js" -> "dist/\x1b[1mfile.js\x1b[0m"
function formatFileName(file: Bun.BunFile): string {
  if (file.name === undefined) {
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
  const displayPath = directory + boldFilename;

  return displayPath
}

// Calculate the actual display width of a string, excluding ANSI escape sequences
function getDisplayWidth(str: string): number {
  return str.replace(/\x1b\[[0-9;]*m/g, '').length;
}


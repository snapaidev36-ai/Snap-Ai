import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const LEGACY_VH_PATTERN =
  /(?:\b(?:min-h-screen|h-screen|max-h-screen)\b)|(?:\b\d+vh\b)/;

const SOURCE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.css',
]);
const IGNORED_PATH_PARTS = new Set(['node_modules', '.next', '.git']);

function shouldCheckFile(filePath) {
  if (!filePath) {
    return false;
  }

  const pathParts = filePath.split('/');
  if (pathParts.some(part => IGNORED_PATH_PARTS.has(part))) {
    return false;
  }

  if (filePath.startsWith('scripts/')) {
    return false;
  }

  const extension = filePath.slice(filePath.lastIndexOf('.'));
  return SOURCE_EXTENSIONS.has(extension);
}

function getTrackedFiles() {
  const output = execSync('git ls-files', { encoding: 'utf8' });
  return output
    .split('\n')
    .map(file => file.trim())
    .filter(Boolean)
    .filter(shouldCheckFile);
}

function getViolations(filePath) {
  const fileContent = readFileSync(join(process.cwd(), filePath), 'utf8');
  const lines = fileContent.split('\n');

  const violations = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    if (LEGACY_VH_PATTERN.test(line)) {
      violations.push({
        filePath,
        lineNumber: lineIndex + 1,
        line: line.trim(),
      });
    }
  }

  return violations;
}

function main() {
  const files = getTrackedFiles();
  const allViolations = files.flatMap(getViolations);

  if (allViolations.length === 0) {
    console.log(
      'Viewport unit check passed: no legacy vh or *-screen height classes found.',
    );
    return;
  }

  console.error(
    'Viewport unit check failed. Use dvh equivalents instead of legacy vh/*-screen height classes.',
  );

  for (const violation of allViolations) {
    console.error(
      `${violation.filePath}:${violation.lineNumber} -> ${violation.line}`,
    );
  }

  process.exit(1);
}

main();

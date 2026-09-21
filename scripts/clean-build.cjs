// Work-in-progress media must never be published, including local CLI builds.
const { rmSync } = require('node:fs');
const { resolve } = require('node:path');
for (const path of [
  'images/_originals_backup',
  'images/de-modificat',
  'images/de-modificat-2',
  'video/about_original.mp4',
]) {
  rmSync(resolve(__dirname, '../build', path), { recursive: true, force: true });
}

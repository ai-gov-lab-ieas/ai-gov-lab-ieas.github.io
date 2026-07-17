import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Multiple test files build the shared dist/ output in a beforeAll hook
    // (see tests/baseLayout.test.ts, tests/seoTags.test.ts). Running files in
    // parallel races two `astro build` invocations against the same dist/
    // directory. Serialize file execution so the first build wins and later
    // files see a complete dist/ via their own existsSync guard.
    fileParallelism: false,
  },
});

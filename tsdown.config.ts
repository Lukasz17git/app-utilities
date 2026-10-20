import { defineConfig } from 'tsdown'

export default defineConfig({
   entry: 'src/index.ts',
   // CJS too, so CJS-only setups (e.g. Jest, NestJS) can still require it
   format: ['esm', 'cjs'],
   dts: true,
   sourcemap: true,
   // Writes "exports", "main" and "types" in package.json from the build output
   exports: true,
   publint: true,
   attw: { level: 'error' },
   // Fails on publint warnings too, except the "use ESM only" advice
   failOnWarn: true,
   suppressWarnings: ['We recommend using the ESM format'],
})

import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html', 'json-summary'],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
      exclude: [
        // Config files
        '**/*.config.*',
        '**/next.config.*',
        '**/postcss.config.*',
        '**/tailwind.config.*',
        '**/vite.config.*',
        '**/vitest.config.*',
        '**/tsconfig.json',
        '**/components.json',
        '**/middleware.ts',

        // Build output and dependencies
        'node_modules/**',
        'dist/**',
        'build/**',
        '.next/**',

        // Test files
        '**/*.test.*',
        '**/*.spec.*',
        '**/test/**',
        '**/tests/**',

        // Type definitions
        '**/*.d.ts',
        '**/types/**',

        // Entry points that are just re-exports
        '**/index.ts',
        '**/index.js',

        // Shadcn/ui components - default components, won't be tested until they are changed
        '**/src/client/features/common/components/ui/**',

        // TRPC and API setup - configuration code
        '**/src/client/utils/trpc.ts',

        // Utility functions - simple wrappers around well-tested libraries
        '**/src/client/lib/utils.ts',

        // Environment files
        '**/.env*',

        // Documentation
        '**/*.md',

        //supabase wrappers
        '**/src/client/utils/supabase-client.ts',
        '**/src/server/utils/supabase-server.ts',
        '**/src/middleware/supabase-middleware.ts',

        // Misc
        '**/.gitignore',
        '**/README*',

        // Provider components - simple wrappers around third-party providers
        '**/src/client/providers/**',
      ],
    },
  },
});

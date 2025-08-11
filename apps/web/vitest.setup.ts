import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Allow importing server-only modules in JSDOM
vi.mock('server-only', () => ({}));

// Provide stable next/navigation APIs in tests
vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');
  return {
    ...actual,
    useSearchParams: () => new URLSearchParams(''),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
  };
});

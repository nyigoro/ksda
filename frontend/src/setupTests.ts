import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock react-dom/client for testing environment
vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: () => {},
    unmount: () => {},
  }),
}));

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

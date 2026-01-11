import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock navigator.serviceWorker
Object.defineProperty(navigator, "serviceWorker", {
  writable: true,
  value: {
    register: jest.fn(() => Promise.resolve()),
    ready: Promise.resolve({
      unregister: jest.fn(() => Promise.resolve()),
    }),
  },
});

// Mock window.navigator.standalone (for iOS PWA detection)
Object.defineProperty(window.navigator, "standalone", {
  writable: true,
  value: false,
});

// Mock document.referrer
Object.defineProperty(document, "referrer", {
  writable: true,
  value: "",
});

// Mock performance.now for performance tests
if (!global.performance) {
  global.performance = {
    now: jest.fn(() => Date.now()),
  };
}

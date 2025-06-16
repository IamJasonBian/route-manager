// jest-dom adds custom jest matchers for asserting on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Mock the SVG elements that might not be available in the test environment
// Provide a minimal getBBox implementation for Recharts SVG elements
(window.SVGElement.prototype as any).getBBox = () => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

// Polyfill ResizeObserver for recharts components in tests
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Expose the polyfill on the global window
// @ts-expect-error jsdom lacks ResizeObserver
window.ResizeObserver = (window as any).ResizeObserver || ResizeObserver;

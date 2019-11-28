export function ensureBrowserCompatibility() {
  // compatibiliy between firefox and chrome
  globalThis.browser = globalThis.browser || globalThis.chrome;
}
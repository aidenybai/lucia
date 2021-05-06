// This file is only provided in IIFE builds
// Including this file doesn't allow Lucia to be tree shaken, which is
// the main reasoning for omitting this file in CJS and ESM builds

import { init, component } from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Lucia allows for a custom initialization function
    // This is to support for delayed init, like for Turbo Drive

    // @ts-expect-error: LuciaInit doesn't exist on window, but we create it.
    const initCallback = window.LuciaInit;

    if (initCallback) {
      init(initCallback);
    } else {
      init();
    }
  });
}

export { init, component };

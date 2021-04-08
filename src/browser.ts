// This file is only provided in IIFE builds
// Including this file doesn't allow Lucia to be tree shaken, which is
// the main reasoning for omitting this file in CJS and ESM builds

import * as Lucia from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Lucia allows for a custom initialization function
    // This is to support for delayed init, like for Turbo Drive

    // @ts-expect-error
    const init = window.LuciaInit;

    if (init) {
      init(Lucia.init);
    } else {
      Lucia.init();
    }
  });
}

export default Lucia;

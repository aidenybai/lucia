// This file is only provided in IIFE builds
// Including this file doesn't allow Lucia to be tree shaken, which is
// the main reasoning for omitting this file in CJS and ESM builds

import { init, component } from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => init());
}

export { init, component };

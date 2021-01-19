import * as Lucia from './index';

const DOMReady = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // @ts-ignore
      resolve();
    }
  });
};

const start = async () => {
  await DOMReady();
  Lucia.init();

  // Turbolinks/Turbo Drive support by default
  document.addEventListener('turbolinks:load', () => Lucia.init());
  document.addEventListener('turbo:load', () => Lucia.init());
};

// @ts-ignore
if (window.__l) {
  // @ts-ignore
  window.__l(() => start());
} else {
  start();
}

export default Lucia;

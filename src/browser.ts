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

const init = () => Lucia.init();

const start = async () => {
  await DOMReady();
  init();

  // Turbolinks/Turbo Drive support by default
  document.addEventListener('turbolinks:load', init);
  document.addEventListener('turbo:load', init);
};

// @ts-ignore
if (window.__l) {
  // @ts-ignore
  window.__l(() => start());
} else {
  start();
}

export default Lucia;

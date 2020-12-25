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

  // Turbolink support by default
  document.addEventListener('turbolinks:load', () => Lucia.init());

  // MutationObserver listening to DOM at runtime
  Lucia.listen((el: HTMLElement) => Lucia.init(el));
};

// @ts-ignore
if (window.__l) {
  // @ts-ignore
  window.__l(() => start());
} else {
  start();
}

export default Lucia;

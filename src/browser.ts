import * as Lucia from './index';

const DOMReady = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      // @ts-expect-error
      resolve();
    }
  });
};

const init = () => Lucia.init(document);

const start = async () => {
  await DOMReady();
  init();

  // Turbolinks/Turbo Drive support by default
  document.addEventListener('turbolinks:load', () => init());
  document.addEventListener('turbo:load', () => init());
};

start();

export default Lucia;

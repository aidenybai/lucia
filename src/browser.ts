import * as Lucia from './index';
import { Directives } from './models/structs';

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

const init = (directives?: Directives) => Lucia.init(document, directives);

const start = async (directives?: Directives) => {
  await DOMReady();
  init(directives);

  // Turbolinks/Turbo Drive support by default
  document.addEventListener('turbolinks:load', () => init(directives));
  document.addEventListener('turbo:load', () => init(directives));
};

// @ts-expect-error
start(window.__l);

export default Lucia;

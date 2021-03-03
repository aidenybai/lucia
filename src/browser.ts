import * as Lucia from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // @ts-expect-error
    if (customLuciaInit in window) {
      // @ts-expect-error
      window.customLuciaInit(Lucia.init);
    } else {
      Lucia.init();
    }
  });
}

export default Lucia;

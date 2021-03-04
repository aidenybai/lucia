import * as Lucia from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // @ts-expect-error
    const customLuciaInit = window.customLuciaInit;

    if (customLuciaInit) {
      customLuciaInit(Lucia.init);
    } else {
      Lucia.init();
    }
  });
}

export default Lucia;

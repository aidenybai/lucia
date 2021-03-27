import * as Lucia from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // @ts-expect-error
    const customLuciaInit = window.LuciaInit;

    if (customLuciaInit) {
      customLuciaInit(Lucia.init);
    } else {
      Lucia.init();
    }
  });
}

export default Lucia;

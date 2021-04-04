import * as Lucia from './index';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
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

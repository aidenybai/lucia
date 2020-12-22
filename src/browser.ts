import * as Lucia from './index';

export default Lucia;

document.addEventListener('DOMContentLoaded', () => Lucia.init());
document.addEventListener('turbolinks:load', () => Lucia.init());

Lucia.observer.observe(document, {
  childList: true,
  attributes: true,
  subtree: true,
});

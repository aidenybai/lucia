import * as Lucia from './index';

document.addEventListener('DOMContentLoaded', () => Lucia.init());
// Turbolink support by default
document.addEventListener('turbolinks:load', () => Lucia.init());

// MutationObserver listening to DOM at runtime
Lucia.listen((el: HTMLElement) => Lucia.init(el));

export default Lucia;

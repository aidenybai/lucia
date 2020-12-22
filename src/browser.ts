import * as Lucia from './index';

export default Lucia;

document.addEventListener('DOMContentLoaded', () => Lucia.init());
document.addEventListener('turbolinks:load', () => Lucia.init());

Lucia.listen((el: HTMLElement) => Lucia.init(el));

export default class ViewManager {
  methods: any;

  constructor(methods: any) {
    this.methods = methods;
  }

  call(method: string): void {
    this.methods[method]();
  }

  traverseAttributes(el: any, prefix: string, id: string): any[] {
    const toBind: any[] = [];
    const descendents = [...el.getElementsByTagName('*')]; // gets all children of ancestor
    descendents.forEach((child) => {
      const attr = child.getAttribute(`${prefix}${id}`);
      if (attr) {
        toBind.push({
          el: child,
          id,
          attr,
        });
      }
    });
  
    // todo: add bindings for elements
    return toBind;
  }
}
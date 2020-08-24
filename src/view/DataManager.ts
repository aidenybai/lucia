export default class DataManager {
  data: any;
  methods: any;

  constructor(data: any, methods: any) {
    this.data = data;
    this.methods = methods;
  }

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  delete(key: string): void {
    this.data[key] = '';
  }

  call(method: string): void {
    this.methods[method]();
  }

  interopTemplates(html: string, data: any, config: any): string {
    const tokens = html.match(config.matchInteropRegex) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(config.curlyBraceTrimRegex, '$1$2');
      const dataKey = compressedToken.substring(2, compressedToken.length - 2);
      html = html.replace(tokens[i], data[dataKey]);
    }
    return html;
  }
}
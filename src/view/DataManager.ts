export default class DataManager {
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  set(key: string, value: any): void {
    this.data[key] = value;
  }

  delete(key: string): void {
    this.data[key] = '';
  }

  bindInterop(html: string, data: any, config: any): string {
    const tokens = html.match(config.matchInteropRegex) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i].replace(config.curlyBraceTrimRegex, '$1$2');
      const dataKey = compressedToken.substring(2, compressedToken.length - 2);
      html = html.replace(tokens[i], data[dataKey]);
    }
    return html;
  }
}
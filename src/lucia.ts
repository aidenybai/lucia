// Maybe switch to webpack

interface LuciaOptions {
  el: string;
  data?: Record<string, any>;
  methods?: Record<string, any>;
}

const LuciaConfig = {
  curlyBraceTrimRegex: /(\{)\s*(\S+)\s*(?=})/gim, // Removes the padding between curly braces: {{ test }} -> {{test}}
  matchInteropRegex: /{{ ?(#[a-z]+ )?[a-z]+.[a-z] ?}}/g, // Gets {{data}}
}; 

class Lucia {
  el: any;
  data: Record<string, any>;
  methods: Record<string, any>;

  constructor(options: LuciaOptions) {
    this.el = document.querySelector(options.el);
    this.data = options.data;
    this.methods = options.methods;

    this.el.innerHTML = this.bindInterop(this.el.innerHTML);
  }

  bindInterop(html: string): string {
    const tokens = html.match(LuciaConfig.matchInteropRegex) || [];
    for (let i = 0; i < tokens.length; i++) {
      const compressedToken = tokens[i]
        .replace(LuciaConfig.curlyBraceTrimRegex, '$1$2')
      const dataAttr = compressedToken.substring(2, compressedToken.length - 2);
      html = html.replace(tokens[i], this.data[dataAttr]); 
    }
    return html;
  }
}

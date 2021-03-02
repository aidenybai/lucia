import { directives, renderDirective } from '../directive';

describe('.directive', () => {
  it('should have valid directives', () => {
    let isValid = true;

    if (typeof directives === 'object') {
      for (const directive in directives) {
        if (typeof directives[directive] !== 'function') {
          isValid = false;
          break;
        }
      }
    } else {
      isValid = false;
    }

    expect(isValid).toEqual(true);
  });

  it('should render directive', () => {
    const el = document.createElement('div');
    const callback = jest.fn();
    const customDirectives = {
      CALLBACK: callback,
    };
    const data = {
      compute: () => {},
      value: '',
      deps: [],
    };
    const props = {
      el,
      parts: ['callback'],
      state: {},
      data,
    };

    renderDirective(props, customDirectives);

    expect(callback).toBeCalled();
  });
});

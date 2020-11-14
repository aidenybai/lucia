export const modelDirective = (
  el: HTMLElement | any,
  _name: string,
  value: string | any,
  view: Record<string, any>
) => {
  el.value = view[value];

  // Type inference
  const model = () => {
    const isNumber = typeof view[value] === 'number' && !isNaN(el.value);
    const isBoolean =
      typeof view[value] === 'boolean' && (el.value === 'true' || el.value === 'false');
    const isNullish =
      (view[value] === null || view[value] === undefined) &&
      (el.value === 'null' || el.value === 'undefined');

    if (isNumber) {
      view[value] = Number(el.value).toPrecision();
    } else if (isBoolean) {
      view[value] = Boolean(el.value);
    } else if (isNullish) {
      if (el.value === 'null') view[value] = null;
      else view[value] = undefined;
    } else {
      view[value] = el.value;
    }
  };

  el.oninput = model;
  model();
};

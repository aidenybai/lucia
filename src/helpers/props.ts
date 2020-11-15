const getProps = (el: Record<string, any>): Record<string, any> => {
  const attributes: Record<string, any> = {};
  const directives: Record<string, any> = {};

  if (el.attributes) {
    for (const { name, value } of el.attributes) {
      if (name.startsWith('l-')) {
        directives[name.replace('l-', '')] = value;
      } else {
        attributes[name] = value;
      }
    }
  }
  return { attributes, directives };
};

export default getProps;

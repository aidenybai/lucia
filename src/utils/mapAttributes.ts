export const mapAttributes = ($el: Record<string, any>): Record<string, any> => {
  const attributesObject: Record<string, any> = {};
  if ($el.attributes) {
    for (const { name, value } of $el.attributes) {
      if (name.startsWith('l-')) {
        attributesObject[name] = value;
      }
    }
  }
  return attributesObject;
};

export default mapAttributes;

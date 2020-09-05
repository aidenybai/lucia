const mapAttributes = ($el: any): Record<string, any> => {
  const attributesObject: any = {};
  if ($el.attributes) {
    for (const attr of $el.attributes) {
      attributesObject[attr.name] = attr.value;
    }
  }
  return attributesObject;
};

export default mapAttributes;

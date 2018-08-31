export const loadNamespace = (namespace, obj) => {
  const preventDuplication = [];
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (
      preventDuplication.indexOf(k) === -1
      && Object.keys(obj).indexOf(`${namespace}-${k.toLowerCase()}`) === -1
    ) {
      obj[`${namespace}-${k.toLowerCase()}`] = v;
    } else {
      preventDuplication.push(`${namespace}-${k.toLowerCase()}`);
    }
  });
};

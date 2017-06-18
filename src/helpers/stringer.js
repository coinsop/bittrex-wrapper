import _ from 'lodash';

export const startCase = str => _.startCase(str);

export const camelCase = str => _.camelCase(str);

export const snakeCase = str => _.snakeCase(str);

export const toLower = str => _.toLower(str);

export const upperFirst = str => _.upperFirst(str);

export const pluralize = (str, options = {}) => {
  const applyOptions = (pre, opts) => {
    let res = pre;
    if (opts) {
      if (opts.startcase) {
        res = startCase(res);
      }
      if (opts.camelcase) {
        res = camelCase(res);
      }
      if (opts.snakecase) {
        res = snakeCase(res);
      }
      if (opts.tolower) {
        res = toLower(res);
      }
      if (opts.upperfirst) {
        res = upperFirst(res);
      }
    }
    return res;
  };

  const plural = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    sis$: 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s'
  };

  const singular = {
    '(quiz)zes$': '$1',
    '(matr)ices$': '$1ix',
    '(vert|ind)ices$': '$1ex',
    '^(ox)en$': '$1',
    '(alias)es$': '$1',
    '(octop|vir)i$': '$1us',
    '(cris|ax|test)es$': '$1is',
    '(shoe)s$': '$1',
    '(o)es$': '$1',
    '(bus)es$': '$1',
    '([m|l])ice$': '$1ouse',
    '(x|ch|ss|sh)es$': '$1',
    '(m)ovies$': '$1ovie',
    '(s)eries$': '$1eries',
    '([^aeiouy]|qu)ies$': '$1y',
    '([lr])ves$': '$1f',
    '(tive)s$': '$1',
    '(hive)s$': '$1',
    '(li|wi|kni)ves$': '$1fe',
    '(shea|loa|lea|thie)ves$': '$1f',
    '(^analy)ses$': '$1sis',
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': '$1$2sis',
    '([ti])a$': '$1um',
    '(n)ews$': '$1ews',
    '(h|bl)ouses$': '$1ouse',
    '(corpse)s$': '$1',
    '(us)es$': '$1',
    s$: ''
  };

  const irregular = {
    move: 'moves',
    foot: 'feet',
    goose: 'geese',
    sex: 'sexes',
    child: 'children',
    man: 'men',
    tooth: 'teeth',
    person: 'people'
  };

  const uncountable = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
  ];
  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(applyOptions(str, options).toLowerCase()) >= 0) {
    return applyOptions(str, options);
  }

  // check for irregular forms
  for (const word in irregular) { // eslint-disable-line no-restricted-syntax
    if (irregular.hasOwnProperty(word)) { // eslint-disable-line no-prototype-builtins
      let pattern;
      let replace;
      if (options.revert) {
        pattern = new RegExp(`${irregular[word]}$`, 'i');
        replace = word;
      } else {
        pattern = new RegExp(`${word}$`, 'i');
        replace = irregular[word];
      }
      if (pattern.test(applyOptions(str, options))) {
        return applyOptions(str.replace(pattern, replace), options);
      }
    }
  }

  let array;
  if (options.revert) {
    array = singular;
  } else {
    array = plural;
  }

  // check for matches using regular expressions
  for (const reg in array) { // eslint-disable-line no-restricted-syntax
    if (array.hasOwnProperty(reg)) { // eslint-disable-line no-prototype-builtins
      const pattern = new RegExp(reg, 'i');
      if (pattern.test(applyOptions(str, options))) {
        return applyOptions(str.replace(pattern, array[reg]), options);
      }
    }
  }

  return applyOptions(str, options);
};

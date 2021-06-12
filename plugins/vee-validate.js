import { extend, localize } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

import fr from 'vee-validate/dist/locale/fr.json';

localize('fr', fr);

Object.keys(rules).forEach((rule) => {
  // eslint-disable-next-line import/namespace
  extend(rule, rules[rule]);
});

// with typescript
for (const [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation,
  });
}

/*

import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';

extend('email', {
  ...email,
  message: "L'email n'est pas valide",
});

extend('required', {
  ...required,
  message: 'Le champs est requis',
});

extend('min', {
  ...min,
  message: '8 charactères minimum',
});
*/

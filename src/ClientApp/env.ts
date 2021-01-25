var fs = require('fs');

const envTs = './src/environments/environment.ts';
const envJs = './src/env.js';

require('dotenv').load();

let envPropJs: string = '\n';
let envPropTs: string = '\n';
const linu_ = /^linu_/i;

Object.keys(process.env)
  .filter((key) => linu_.test(key))
  .forEach((key) => {
    let value = process.env[key];
    envPropJs = envPropJs + '   window.__env.' + key + " = '" + value + "';\n";
    //envPropTs = envPropTs + "  "+ key + ":'" + value + "',\n";
    envPropTs =
      envPropTs + '  ' + key + ": window['__env']['" + key + "']" + ',\n';
  });

const envConfigJs = `(function (window) {
   window.__env = window.__env || {};
   window.__env.production = ${process.env.production || false};${envPropJs}
})(this)`;

const envConfigTs = `export const environment = {
  production: ${process.env.production || false},${envPropTs}
};`;

// console.log('The file `env.js` will be written with the following content: \n');
// console.log(envConfigJs);
fs.writeFile(envJs, envConfigJs, function (err) {
  if (err) {
    //console.log('MADP');
    throw console.error(err);
  } else {
    //console.log(`Angular env.js file generated correctly at ${envJs} \n`);
  }
});

// console.log(
//   'The file `environment.ts` will be written with the following content: \n'
// );
//console.log(envConfigTs);
fs.writeFile(envTs, envConfigTs, function (err) {
  if (err) {
    //console.log('MADP');
    throw console.error(err);
  } else {
    // console.log(
    //   `Angular environment.ts file generated correctly at ${envTs} \n`
    // );
  }
});

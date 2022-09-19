import {readdirSync, readFileSync, writeFileSync, existsSync} from 'fs';
import {resolve} from 'path';
import {randomBase62} from "./lib/random";
import {fillTemplatesVars, TemplateObjectInterface, TemplateVariablesInterface} from "./lib/templateParse";

let [,, ...args] = process.argv;

const flags: string[] = [];
const dirs: string[] = [];
args.forEach(arg =>
    /^-[\w.-]+/.test(arg)
        ? flags.push(arg)
        : dirs.push(resolve(arg))
);

if ( !dirs.length )
  dirs.push('.');

process.stdout.write(`Parsing the following directories for template files:\n${dirs.map(d => ` - ${d}\n`).join('')}`);

const preDefinedVariables: TemplateVariablesInterface = {
  randomBase62: randomBase62,
};

let templatesFilepaths: string[] = new Array<string>().concat(...dirs.map(dir =>
    readdirSync(dir)
        .filter(filename => /\.template$/.test(filename))
        .map(filename => `${dir}/${filename}`)
));

process.stdout.write(`Found the following template files:\n${templatesFilepaths.map(path => ` - ${path}\n`).join('')}`)

// Ignore existing files if -f flag not provided
if ( !flags.includes('-f') && !flags.includes('--force-override') ) {
  templatesFilepaths = templatesFilepaths.filter(templateFilepath => {
    const filepath = templateFilepath.replace(/\.template$/, '');
    if (existsSync(filepath)) {
      process.stdout.write(`File "${filepath}" exists. Ignoring...\n`);
      return false
    }
    return true;
  });
}

if ( !templatesFilepaths.length ) {
  process.stdout.write(`No template files to generate. Nothing to do.\n`);
  process.exit();
}

const templatesData = templatesFilepaths.map(templateFilename =>
    readFileSync(templateFilename)
        .toString()
);

let lastTemplateObject: TemplateObjectInterface = {
  templates: templatesData,
  variables: preDefinedVariables
}

while ( Object.keys(lastTemplateObject.variables).length )
  lastTemplateObject = fillTemplatesVars(lastTemplateObject);

process.stdout.write(`Created the following files:\n`);
lastTemplateObject.templates.forEach((data, i) => {
  const filepath = templatesFilepaths[i].replace(/\.template$/, '');
  writeFileSync(filepath, data);
  process.stdout.write(` - ${filepath} (${data.length.toLocaleString()} bytes)\n`)
});

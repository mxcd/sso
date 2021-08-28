let fs = require('fs')
let ejs = require('ejs')

function renderTemplate(templateName, variables) {
  const templateFilePath = `./scripts/templates/${templateName}.ejs`;
  if(!fs.existsSync(templateFilePath)) {
    throw new Error(`File ${templateFilePath} does not exist`);
  }
  const templateData = fs.readFileSync(templateFilePath, 'utf8');
  const resultData = ejs.render(templateData, variables, );
  return resultData;
}

module.exports = { renderTemplate }

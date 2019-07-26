const Fs = require('fs');
const Path = require('path')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')

class Pdfer {
  async html(data, templates) {
    // console.log('html()');
    try {
      // Fetch and parse the JSON.
      let json;
      const dataPath = Path.resolve(data)
      try {
         json = Fs.readFileSync(dataPath, { encoding: 'utf8' });
      } catch (err) {
        // An error occurred fetching template file
        console.error(err);
      }
      const jsonparse = JSON.parse(json);
      // Fetch the template.
      // console.log('template string');
      // console.log(templates);
      let t = templates + '/template.hbs';
      const templatePath = Path.resolve(t);
      let content;
      try {
         content = Fs.readFileSync(templatePath, { encoding: 'utf8' })
      } catch (err) {
        // An error occurred fetching template file
        console.error(err);
      }
      // Register partials
      let stylesPartial = Fs.readFileSync('./src/assets/templates/styles.hbs', 'utf8');
      Handlebars.registerPartial('styles', stylesPartial);
      // console.log('partials:');
      // console.log(Handlebars.partials);
      // instead of {{> partialName}} use {{partial "templateName"}}
      // Handlebars.registerHelper('partial', function (templateName) {
      //   return new Handlebars.SafeString(JST[templateName](this));
      // });
      // for(let [name, template] of Object.entries(Handlebars.partials)) {
      //   Handlebars.partials[name] = Handlebars.compile(template);
      // }
      // compile and render the template with handlebars
      let handlebars;
      try {
        handlebars = Handlebars.compile(content);
      } catch (e) {
        throw new Error(e)
      }
      // Return the handlebars template rendered with data
      return handlebars(jsonparse)
    } catch (error) {
      throw new Error('Cannot create HTML template.')
    }
  }

  async pdf(data, templates, output) {
    // console.log('pdf()');
    const html = await this.html(data, templates)
    // console.log(html)
    const browser = await Puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    await page.pdf({
      path: output,
      format: 'A4',
      printBackground: true
    })
    process.exit()
  }
}

module.exports = Pdfer;

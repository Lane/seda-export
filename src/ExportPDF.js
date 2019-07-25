const args = require('yargs').argv;
const Pdfer = require('./Pdfer.js');

console.log('exportPDF called.');
console.log('data: ' + args.data);
console.log('output: ' + args.output);

// Init PDF generation
var pdfer = new Pdfer();
pdfer.pdf(args.data, args.template, args.output);
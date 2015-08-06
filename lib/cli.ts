/// <reference path="../typings/tsd.d.ts" />

import fs = require("fs");
import path = require("path");
import program = require("commander");
import mkdirp = require("mkdirp");

import dtsgenerator = require("./index");

var pkg = require("../package.json");


// <hoge> is reuired, [hoge] is optional
program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option("-o, --out [file]", "output d.ts filename")
  .parse(process.argv);

interface ICommandOptions {
  out?: string;
  args: string[];
}
var opts: ICommandOptions = <any>program;

if (opts.args.length === 0) {
  program.help();
} else {
  processGenerate();
}

function processGenerate(): void {

    var contents : { [filename : string]: string } = {}
    
    opts.args.forEach((arg) => {
      contents[arg] = fs.readFileSync(arg, { encoding: 'utf-8' }); 
    });

    var schemas: dtsgenerator.model.IJsonSchema[] = Object.keys(contents).map((key) => contents[key]);
    var result = dtsgenerator(schemas);

    if (opts.out) {
      mkdirp.sync(path.dirname(opts.out));
      fs.writeFileSync(opts.out, result, { encoding: 'utf-8' });
    } else {
      console.log(result);
    }
}


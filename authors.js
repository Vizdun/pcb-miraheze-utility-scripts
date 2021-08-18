var parser = require('fast-xml-parser');
var fs = require('fs');

datastack = parser.parse(fs.readFileSync("datastack/pcba.xml").toString()).mediawiki.page

console.log(datastack[0])

result = ""

/*for (const item of datastack) {
  result += datastack.title + " by " + datastack
}*/
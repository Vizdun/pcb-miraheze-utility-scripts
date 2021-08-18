var bot = require("nodemw")
var fs = require("fs")
// pass configuration object
var client = new bot({
  protocol: "https", // Wikipedia now enforces HTTPS
  server: "polcompball.fandom.com", // host name of MediaWiki-powered site
  path: "", // path to api.php script
  debug: false, // is more verbose when set to true
})

client.getPagesInNamespace(0, function (err, data) {
  // error handling
  if (err) {
    console.error(err)
    return
  }
  for (p of data) {
    console.log(p.title)
  }
})

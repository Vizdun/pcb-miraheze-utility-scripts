var bot = require("nodemw")
var download = require("download-file")
var fs = require("fs")
// pass configuration object
var client = new bot({
  protocol: "https", // Wikipedia now enforces HTTPS
  server: "polcompballanarchy.fandom.com", // host name of MediaWiki-powered site
  path: "", // path to api.php script
  debug: false, // is more verbose when set to true
})

shitWeAlreadyHaveLolLmaoIHateThisFuckingScript = fs.readdirSync("./images")

client.getPagesInNamespace(6, function (err, data) {
  // error handling
  if (err) {
    console.error(err)
    return
  }
  data = data.filter((item) => {
    return (
      shitWeAlreadyHaveLolLmaoIHateThisFuckingScript.indexOf(
        item.title.split("File:")[1].replace(/\s/g, "_"),
      ) === -1
    )
  })
  for (p of data) {
    client.getImageInfo(p.title, function (e, d) {
      if (e) {
        console.error(e)
        return
      }
      if (d == null) {
        console.log(p.title)
        return
      }
      var options = {
        directory: "./images/",
        filename: d.descriptionurl.replace(/^http.*?\/File:/, ""),
      }
      download(d.url, options, function (err) {
        if (err) throw err

        console.log(
          `downloaded ${options.filename}`,
        )
      })
    })
  }
})

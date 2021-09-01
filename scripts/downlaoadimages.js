import bot from "nodemw"
import download from "download-file"
import fs from "fs"
// pass configuration object
var client = new bot({
	protocol: "https", // Wikipedia now enforces HTTPS
	server: "polcompball.fandom.com/pl", // host name of MediaWiki-powered site
	path: "", // path to api.php script
	debug: false, // is more verbose when set to true
})

// uncomment in case of continued download (instead of a new one)

// shitWeAlreadyHaveLolLmaoIHateThisFuckingScript = fs.readdirSync("./images")

client.getPagesInNamespace(6, function (err, data) {
	// error handling
	if (err) {
		console.error(err)
		return
	}
	// data = data.filter((item) => {
	//   return (
	//     shitWeAlreadyHaveLolLmaoIHateThisFuckingScript.indexOf(
	//       item.title.split("File:")[1].replace(/\s/g, "_"),
	//     ) === -1
	//   )
	// })
	for (const p of data) {
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
				filename:
					d.descriptionurl.split("/")[d.descriptionurl.split("/").length - 1],
			}
			download(d.url, options, function (err) {
				if (err) throw err

				console.log(`downloaded ${options.filename}`)
			})
		})
	}
})

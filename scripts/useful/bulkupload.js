import fs from "fs"

import { setup } from "../startup.js"
setup.then(async (bot) => {
	var files = fs.readdirSync("./images")

	var imagesWeKnowThereAre = []

	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "allpages",
		aplimit: "max",
		apnamespace: 6,
	})) {
		let pages = json.query.allpages.map((page) => page.title)
		imagesWeKnowThereAre = imagesWeKnowThereAre.concat(pages)
	}

	imagesWeKnowThereAre = imagesWeKnowThereAre.map((item) => {
		return item.split("File:")[1].replace(/\s/g, "_")
	})

	files = files.filter((item) => {
		return imagesWeKnowThereAre.indexOf(item) === -1
	})

	for (const item of files) {
		var exists = await bot.read("File:" + item)
		if (exists.missing) {
			console.log("uploading " + item)
			try {
				await bot.upload("./images/" + item, item, "bulk upload")
			} catch (e) {
				console.log(e.code)
			}
		}
	}
})

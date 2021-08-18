const { mwn } = require("mwn")
const fs = require("fs")

async function actualRoutine() {
	const bot = await mwn.init({
		apiUrl: "https://polcompball.miraheze.org/w/api.php",

		// Can be skipped if the bot doesn't need to sign in
		username: "Vizdun@VizBot",
		password: "password",

		// Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
		userAgent: "vizbot",

		// Set default parameters to be sent to be included in every API request
		defaultParams: {
			assert: "user", // ensure we're logged in
		},
	})
	files = fs.readdirSync("./images")

	imagesWeKnowThereAre = []

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
		exists = await bot.read("File:" + item)
		if (exists.missing) {
			console.log("uploading " + item)
			try {
				await bot.upload("./images/" + item, item, "bulk upload")
			} catch (e) {
				console.log(e.code)
			}
		}
	}
}

actualRoutine()

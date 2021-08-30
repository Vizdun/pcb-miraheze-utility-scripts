// unmaintained, do not use

const { mwn } = require("mwn")
const fs = require("fs")

startTime = new Date()

async function actualRoutine() {
	const bot = await mwn.init({
		apiUrl: "https://polcompballanarchy.miraheze.org/w/api.php",

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

	bot.setOptions({
		silent: true, // suppress messages (except error messages)
		retryPause: 5000, // pause for 5000 milliseconds (5 seconds) on maxlag error.
		maxRetries: 3, // attempt to retry a failing requests upto 3 times
	})

	await bot
		.request({
			action: "query",
			format: "json",
			list: "allimages",
			aisort: "timestamp",
			aidir: "older",
			aistart: "now",
			aiend: fs.readFileSync("lastshot").toString(),
			ailimit: "max",
		})
		.then((data) => {
			for (let i = 0; i < data.query.allimages.length; i++) {
				if (!data.query.allimages[i].name.startsWith("PCB-")) {
					bot
						.move(
							"File:" + data.query.allimages[i].name,
							"File:PCB-" + data.query.allimages[i].name,
							'All images on this wiki must start with the "PCB-" prefix.',
							{
								movesubpages: true,
								movetalk: true,
							},
						)
						.catch((error) => {
							if (error.code == "articleexists") {
								bot.delete(
									"File:" + data.query.allimages[i].name,
									'Duplicate without the "PCB-" prefix.',
								)
							}
						})
				}
			}
			fs.writeFileSync("lastshot", startTime.getTime().toString().slice(0, 10))
		})
}

actualRoutine()

const { mwn } = require("mwn")

startDate = Date.now()

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

	var all_images = []
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "allimages",
		ailimit: "max",
	})) {
		let pages = json.query.allimages.map((page) => page.name)
		all_images = all_images.concat(pages)
	}

	movedCounter = 0
	delCounter = 0
	failedCounter = 0

	bot.batchOperation(
		all_images,
		(page, idx) => {
			if (!page.startsWith("PCB-")) {
				movedCounter++
				bot
					.move(
						"File:" + page,
						"File:PCB-" + page,
						'All images on this wiki must start with the "PCB-" prefix.',
						{
							movesubpages: true,
							movetalk: true,
						},
					)
					.catch((error) => {
						if (error.code == "articleexists") {
							movedCounter--
							delCounter++
							bot.delete("File:" + page, 'Duplicate without the "PCB-" prefix.')
						} else {
							movedCounter--
							failedCounter++
						}
					})
			}
			return Promise.resolve()
		},
		/* concurrency */ 5,
		/* retries */ 2,
	)
	console.log(
		movedCounter +
			" pages moved, " +
			delCounter +
			" pages deleted, " +
			failedCounter +
			" failed (" +
			((Date.now() - startDate) / 1000).toString() +
			"s)",
	)
}

actualRoutine()

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

	all_images = all_images.filter((item) => {
		return item.startsWith("PCB-")
	})

	bot
		.seriesBatchOperation(
			all_images,
			(page, idx) => {
				console.log(`${idx} out of ${all_images.length}`)
				movedCounter++
				bot
					.move("File:" + page, "File:" + page.slice(4), "reverse", {
						movesubpages: true,
						movetalk: true,
						ignorewarnings: 1,
					})
					.catch((error) => {
						if (error.code == "articleexists") {
							delCounter++
							bot.delete("File:" + page.slice(4), "reversing shit").then(() => {
								bot
									.move("File:" + page, "File:" + page.slice(4), "reverse", {
										movesubpages: true,
										movetalk: true,
									})
									.catch((error) => {
										movedCounter--
										failedCounter++
										console.log(error.code)
									})
							})
						} else {
							movedCounter--
							failedCounter++
						}
					})
				return Promise.resolve()
			},
			/* concurrency */ 2000,
			/* retries */ 0,
		)
		.then(() => {
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
		})
}

actualRoutine()

const { mwn } = require("mwn")

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

	bot.setOptions({
		silent: true, // suppress messages (except error messages)
		retryPause: 5000, // pause for 5000 milliseconds (5 seconds) on maxlag error.
		maxRetries: 3, // attempt to retry a failing requests upto 3 times
	})

	var pagesweknowthereare = []

	for await (const i of [0]) {
		try {
			for await (let json of bot.continuedQueryGen({
				action: "query",
				list: "allpages",
				aplimit: "max",
				apnamespace: i,
			})) {
				let pages = json.query.allpages.map((page) => page.title)
				pagesweknowthereare = pagesweknowthereare.concat(pages)
			}
		} catch {}
	}

	usuablepages = await pagesweknowthereare.filter((item) => {
		try {
			return item.search("List of movements/") != -1
		} catch (e) {
			return false
		}
	})

	bot.batchOperation(
		usuablepages,
		(page, idx) => {
			return bot
				.move(
					page,
					"List of movements/Political Parties/" + page.split("/")[1],
					"moving to political parties",
				)
				.then(() => {
					console.log(`moved ${page}`)
					return Promise.resolve()
				})
				.catch((e) => {
					console.log(`\x1b[31m error ${e.code} at ${page}\x1b[0m`)
					return Promise.resolve()
				})
		},
		/* concurrency */ 5,
		/* retries */ 2,
	)
}

actualRoutine()

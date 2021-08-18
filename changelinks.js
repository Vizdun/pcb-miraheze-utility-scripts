function replaceLinks(str) {
	return (
		str.split("[[w:c:polcompball")[0] +
		"{{PCB|" +
		str.split("[[w:c:polcompball")[1].replace("]]", "}}")
	)
}

const { mwn } = require("mwn")

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

	bot.seriesBatchOperation(
		pagesweknowthereare,
		async (page, idx) => {
			pageData = await bot.read(page)

			if (pageData.revisions[0].content.search("[[w:c:polcompball")) {
				await bot.save(
					page,
					replaceLinks(pageData.revisions[0].content),
					"replaced links",
				)
				return Promise.resolve()
			} else {
				return Promise.resolve()
			}
		},
		500,
	)
}

actualRoutine()

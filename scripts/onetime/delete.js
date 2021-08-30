const { mwn } = require("mwn")
const fs = require("fs")

datastack = JSON.parse(fs.readFileSync("datastack/pcb.json")).mediawiki.page

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

	for await (const i of [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 90, 91, 92, 93, 100,
		101, 102, 103, 104, 105, 106, 107, 486, 487, 828, 829, 1198, 1199, 2300,
		2301, 2302, 2303, 2600, 5500, 5501,
	]) {
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

	usuablepages = await datastack.filter((item) => {
		try {
			if (
				!pagesweknowthereare.includes(item.title) &&
				item.revision.text.__text.length > 0 &&
				!item.title.startsWith("File:")
			) {
				return true
			} else {
				return false
			}
		} catch (e) {
			return false
		}
	})

	titles = await usuablepages.map((item) => {
		return item.title
	})

	contents = await usuablepages.map((item) => {
		return item.revision.text.__text
	})
	console.log(titles)
	bot.batchOperation(
		titles,
		(page, idx) => {
			return bot
				.create(page, contents[idx], "restored from my backup")
				.then(() => {
					console.log(
						`restored ${page} (${contents[idx].length.toLocaleString(
							"en-GB",
						)})`,
					)
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

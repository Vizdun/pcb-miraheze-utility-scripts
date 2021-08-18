const { mwn } = require("mwn")
const fs = require("fs")
const { ok } = require("assert")

datastack = JSON.parse(fs.readFileSync("datastack/pcb.json")).mediawiki.page

async function actualRoutine() {
	const bot = await mwn.init({
		apiUrl: "https://polcompball.fandom.com/api.php",

		// Can be skipped if the bot doesn't need to sign in
		username: "Vizdun@VizdunBot",
		password: "password",

		// Set your user agent (required for WMF wikis, see https://meta.wikimedia.org/wiki/User-Agent_policy):
		userAgent: "VizdunBot",

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

	bot.batchOperation(
		pagesweknowthereare,
		(page, idx) => {
			console.log(page)
			return bot
				.request({
					action: "protect",
					title: page,
					protections: "edit=sysop",
					token: bot.csrfToken,
					reason: "migration to polcompball.miraheze.org",
				})
				.then(() => {
					return Promise.resolve()
				})
		},
		/* concurrency */ 5,
		/* retries */ 2,
	)
}

actualRoutine()

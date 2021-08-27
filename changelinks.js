const fs = require("fs")

const login = JSON.parse(fs.readFileSync("login.json").toString())

const { mwn } = require("mwn")

async function actualRoutine() {
	const bot = await mwn.init({
		apiUrl: "https://polcompball.miraheze.org/w/api.php",

		// Can be skipped if the bot doesn't need to sign in
		username: login.username,
		password: login.password,

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
			bot.edit(page, (rev) => {
				let text = rev.content.replace("[[wp:", "[[w:")
				return {
					text: text,
					summary: "replacing wp with w",
					minor: true,
				}
			})
		},
		500,
	)
}

actualRoutine()

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

	var usercontribs = []
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "usercontribs",
		ucuser: "Vizdun",
		uclimit: "max",
	})) {
		let contribs = json.query.usercontribs.map((contrib) => contrib)
		usercontribs = usercontribs.concat(contribs)
	}

	usercontribs.sort(function (a, b) {
		return b.size - a.size
	})

	console.log(usercontribs.length)
}

actualRoutine()

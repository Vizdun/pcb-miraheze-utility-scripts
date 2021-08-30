// unmaintained, do not use
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
			//assert: 'user' // ensure we're logged in
		},
	})

	bot.setOptions({
		silent: true, // suppress messages (except error messages)
		retryPause: 5000, // pause for 5000 milliseconds (5 seconds) on maxlag error.
		maxRetries: 3, // attempt to retry a failing requests upto 3 times
	})

	var users = []
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "allusers",
		aulimit: "max",
	})) {
		let allusers = json.query.allusers.map((user) => user.userid)
		users = users.concat(allusers)
	}

	var contribusercount = {}
	var contribusersize = {}
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "usercontribs",
		uclimit: "max",
		ucuserids: users.join("|"),
	})) {
		for (let i = 0; i < json.query.usercontribs.length; i++) {
			if (
				!contribusercount[json.query.usercontribs[i].title] ||
				!contribusercount[json.query.usercontribs[i].title].includes(
					json.query.usercontribs[i].userid,
				)
			) {
				if (!contribusercount[json.query.usercontribs[i].title]) {
					contribusercount[json.query.usercontribs[i].title] = []
					contribusersize[json.query.usercontribs[i].title] = 0
				}
				contribusercount[json.query.usercontribs[i].title].push(
					json.query.usercontribs[i].userid,
				)
				contribusersize[json.query.usercontribs[i].title] +=
					(1 /
						(Date.now() - Date.parse(json.query.usercontribs[i].timestamp))) *
					(json.query.usercontribs[i].size * 0.25)
			}
		}
	}

	formedcontribs = {}

	for (var item in contribusercount) {
		formedcontribs[item] = contribusersize[item] * contribusercount[item].length
	}

	formedcontribs = Object.fromEntries(
		Object.entries(formedcontribs).sort(([, a], [, b]) => a - b),
	)

	console.log(formedcontribs)
}

actualRoutine()

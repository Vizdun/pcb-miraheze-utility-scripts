import fs from "fs"

const login = JSON.parse(fs.readFileSync("login.json").toString())

import { mwn } from "mwn"

export var setup = mwn
	.init({
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
	.then((bot) => {
		bot.setOptions({
			silent: true, // suppress messages (except error messages)
			retryPause: 5000, // pause for 5000 milliseconds (5 seconds) on maxlag error.
			maxRetries: 3, // attempt to retry a failing requests upto 3 times
		})
		return bot
	})

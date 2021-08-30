// unmaintained, do not use

/*
		don't even try
*/
const fs = require("fs")

movementsSource = fs
	.readFileSync("./datastack/movements")
	.toString()
	// .split("==Political parties==")[1]
	// .split("==Militant and/or Criminal Groups==")[0]
	.split("==Fictional Parties and Movements==")[1]
	.split("==Notes==")[0]
	.split(/\n===(?!=)/)
	.map((item) => {
		return [item.split("===")[0], item.split(/([^=]|^)===([^=]|$)/)[3]]
	})
	// .map((item) => {
	// 	return item.split("===")[0]
	// })
	// .map((item) => {
	// 	try {
	// 		return `===${item[0]}===\n{{:List of movements/Political Parties/${item[0]
	// 			.split("[[")[1]
	// 			.split("]]")[1]
	// 			.trim()}}}`
	// 	} catch (e) {
	// 		return false
	// 	}
	// })
	// .map((item) => {
	// 	try {
	// 		return `===${
	// 			item[0]
	// 		}===\n{{:List of movements/Militant and/or Criminal Groups/${item[0].trim()}}}`
	// 	} catch (e) {
	// 		return false
	// 	}
	// })
	// .map((item) => {
	// 	try {
	// 		return `===${item[0].split("]]")[0] + "]]"}${
	// 			"[[" +
	// 			"List of movements/Political Parties/" +
	// 			item[0].split("]]")[1].trim() +
	// 			"|" +
	// 			item[0].split("]]")[1].trim() +
	// 			"]]"
	// 		}===`
	// 	} catch (e) {
	// 		return false
	// 	}
	// })
	.map((item) => {
		try {
			return `===${
				"[[" +
				"List of movements/Fictional Parties and Movements/" +
				item[0].trim() +
				"|" +
				item[0].trim() +
				"]]"
			}===`
		} catch (e) {
			return false
		}
	})
	.filter((item) => {
		return item
	})
	.join("\n")

console.log(movementsSource)
// .map((item) => {
// 	try {
// 		return [
// 			"List of movements/" +
// 				"Fictional Parties and Movements/" +
// 				item[0].trim(),
// 			item[1].trim(),
// 		]
// 	} catch (e) {
// 		return false
// 	}
// })
// .filter((item) => {
// 	return item
// })

// console.log(movementsSource)

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

	bot.seriesBatchOperation(
		movementsSource,
		(item, idx) => {
			return bot
				.edit(item[0], (rev) => {
					return {
						// return parameters needed for [[mw:API:Edit]]
						text: item[1],
						summary: "creating subpages",
						minor: false,
					}
				})
				.then(() => {
					console.log(
						`created ${
							"List_of_movements/" +
							item[0].split("[[")[1].split("]]")[1].trim()
						}`,
					)
					return Promise.resolve()
				})
				.catch((e) => {
					console.log(
						`\x1b[31m error ${e.code} at ${
							"List_of_movements/" +
							item[0].split("[[")[1].split("]]")[1].trim()
						}\x1b[0m`,
					)
					return Promise.resolve()
				})
		},
		/* concurrency */ 500,
		/* retries */ 2,
	)
}

// actualRoutine()

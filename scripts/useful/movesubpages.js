import { setup } from "../startup.js"
setup.then(async (bot) => {
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
})

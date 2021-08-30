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
})

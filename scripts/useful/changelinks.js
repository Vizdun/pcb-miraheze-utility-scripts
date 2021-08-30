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
})

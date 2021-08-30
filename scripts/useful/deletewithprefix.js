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

	var pagesweuse = pagesweknowthereare.filter((item) => {
		return (
			item.startsWith("User") ||
			item.startsWith("Thread") ||
			item.startsWith("Message")
		)
	})

	bot.batchOperation(
		pagesweuse,
		async (page, idx) => {
			await bot.delete(page, "nuking this")
			console.log("deleted " + page)
		},
		4,
	)
})

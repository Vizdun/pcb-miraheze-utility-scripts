startDate = Date.now()

import { setup } from "../startup.js"
setup.then(async (bot) => {
	var all_images = []
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "allimages",
		ailimit: "max",
	})) {
		let pages = json.query.allimages.map((page) => page.name)
		all_images = all_images.concat(pages)
	}

	movedCounter = 0
	delCounter = 0
	failedCounter = 0

	all_images = all_images.filter((item) => {
		return item.startsWith("PCB-")
	})

	bot
		.seriesBatchOperation(
			all_images,
			(page, idx) => {
				console.log(`${idx} out of ${all_images.length}`)
				movedCounter++
				bot
					.move("File:" + page, "File:" + page.slice(4), "reverse", {
						movesubpages: true,
						movetalk: true,
						ignorewarnings: 1,
					})
					.catch((error) => {
						if (error.code == "articleexists") {
							delCounter++
							bot.delete("File:" + page.slice(4), "reversing shit").then(() => {
								bot
									.move("File:" + page, "File:" + page.slice(4), "reverse", {
										movesubpages: true,
										movetalk: true,
									})
									.catch((error) => {
										movedCounter--
										failedCounter++
										console.log(error.code)
									})
							})
						} else {
							movedCounter--
							failedCounter++
						}
					})
				return Promise.resolve()
			},
			/* concurrency */ 2000,
			/* retries */ 0,
		)
		.then(() => {
			console.log(
				movedCounter +
					" pages moved, " +
					delCounter +
					" pages deleted, " +
					failedCounter +
					" failed (" +
					((Date.now() - startDate) / 1000).toString() +
					"s)",
			)
		})
})

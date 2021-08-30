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

	bot.batchOperation(
		all_images,
		(page, idx) => {
			if (!page.startsWith("PCB-")) {
				movedCounter++
				bot
					.move(
						"File:" + page,
						"File:PCB-" + page,
						'All images on this wiki must start with the "PCB-" prefix.',
						{
							movesubpages: true,
							movetalk: true,
						},
					)
					.catch((error) => {
						if (error.code == "articleexists") {
							movedCounter--
							delCounter++
							bot.delete("File:" + page, 'Duplicate without the "PCB-" prefix.')
						} else {
							movedCounter--
							failedCounter++
						}
					})
			}
			return Promise.resolve()
		},
		/* concurrency */ 5,
		/* retries */ 2,
	)
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

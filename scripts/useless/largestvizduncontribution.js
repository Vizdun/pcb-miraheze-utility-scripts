import { setup } from "../startup.js"
setup.then(async (bot) => {
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
})

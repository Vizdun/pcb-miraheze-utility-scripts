import { setup } from "../startup.js"
setup.then(async (bot) => {
	var users = []
	for await (let json of bot.continuedQueryGen({
		action: "query",
		list: "allusers",
		auprop: "editcount"
	})) {
		let contribs = json.query.allusers.map((contrib) => [contrib.name ,contrib.editcount])
		users = users.concat(contribs)
	}

	users.sort(function (a, b) {
		return b[1] - a[1]
	})

	console.log(JSON.stringify(users))
})

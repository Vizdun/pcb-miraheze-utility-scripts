const { Client, Intents } = require("discord.js")
const fs = require("fs")

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
})

datastacks = {
	pcba: Object.fromEntries(
		JSON.parse(fs.readFileSync("datastack/pcba.json")).mediawiki.page.map(
			(item) => [item.title, item.revision.text.__text],
		),
	),
}

function datastacksLength() {
	datastackL = 0
	for (const item in datastacks) {
		datastackL += Object.keys(datastacks[item]).length
	}
	return datastackL
}

datastack = { ...datastacks.pcba }

matching2 = new RegExp(/^(<@!857930700267585546>|<@857930700267585546>)/)

client.on("ready", () => {
	console.log(`serving ${datastacksLength()} pages`)
})

function sendReply(page, message, stack = datastack) {
	page.split(".").slice(0, -1).join(".")
	fs.writeFileSync("./requestfiles/" + page + ".txt", stack[page])
	message.channel.send({
		content: `<@${message.author.id}>`,
		files: ["./requestfiles/" + page + ".txt"],
	})
}

function errorReply(text, message) {
	message.channel.send({
		content: `<@${message.author.id}> ${text}`,
	})
}

function sendHelp(message) {
	message.channel.send({
		content: `<@689266708044841035> write the documentation ni`,
	})
}

function uselessFunctionThatIWillUseOnce(items) {
	if (items.length > 4) {
		items[4] = items[4] + "..."
		return items
	} else {
		return items
	}
}

client.on("messageCreate", (message) => {
	if (message.author.bot) return
	if (message.content.match(matching2)) {
		if (message.content.split('"')[1]) {
			requestedPage = message.content.split('"')[1]
			requestedStack = false
			if (
				message.content.split('"').length > 2 &&
				message.content.split('"')[2].trim() != ""
			) {
				requestedStack = message.content.split('"')[2].trim()
			}
			if (requestedStack) {
				if (datastacks[requestedStack]) {
					if (datastacks[requestedStack][requestedPage]) {
						sendReply(requestedPage, message, datastacks[requestedStack])
					} else {
						possibilities = []
						if (requestedPage.length > 4) {
							var replace = `(?=.*${requestedPage.replace(" ", ")(?=.*")}).+`
							var re = new RegExp(replace, "i")
							possibilities = Object.keys(datastacks[requestedStack])
								.filter((item) => item.match(re))
								.slice(0, 5)
						}
						if (possibilities.length > 0) {
							message.channel.send({
								content: `<@${
									message.author.id
								}> entries similar to ${requestedPage} in datastack \`${requestedStack}\`:\n\`${uselessFunctionThatIWillUseOnce(
									possibilities,
								).join("\n")}\``,
							})
						} else {
							errorReply(
								`entry \`${requestedPage}\` wasn't found in datastack \`${requestedStack}\``,
								message,
							)
						}
					}
				} else {
					var replace = `(?=.*${requestedStack.replace(" ", ")(?=.*")}).+`
					var re = new RegExp(replace, "i")
					possibilities = Object.keys(datastacks)
						.filter((item) => item.match(re))
						.slice(0, 5)
					if (possibilities.length > 0) {
						message.channel.send({
							content: `<@${
								message.author.id
							}> datastacks similar to ${requestedStack}:\n\`${uselessFunctionThatIWillUseOnce(
								possibilities,
							).join("\n")}\``,
						})
					} else {
						errorReply(`datastack \`${requestedStack}\` wasn't found`, message)
					}
				}
			} else {
				if (datastack[requestedPage]) {
					sendReply(requestedPage, message, datastack)
				} else {
					possibilities = []
					if (requestedPage.length > 4) {
						var replace = `(?=.*${requestedPage.replace(" ", ")(?=.*")}).+`
						var re = new RegExp(replace, "i")
						possibilities = Object.keys(datastack)
							.filter((item) => item.match(re))
							.slice(0, 5)
					}
					if (possibilities.length > 0) {
						message.channel.send({
							content: `<@${
								message.author.id
							}> entries similar to ${requestedPage}:\n\`${uselessFunctionThatIWillUseOnce(
								possibilities,
							).join("\n")}\``,
						})
					} else {
						errorReply(`entry \`${requestedPage}\` wasn't found`, message)
					}
				}
			}
		} else if (message.content.split(">")[1]) {
			switch (message.content.split(">")[1].trim()) {
				case "list":
					message.channel.send({
						content: `<@689266708044841035> please actually make the list feature for real`,
					})
					break
				default:
					sendHelp(message)
					break
			}
		} else {
			sendHelp(message)
		}
	}
})

client.login("token")

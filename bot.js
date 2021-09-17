// import dependencies
const { Client, Intents } = require("discord.js")
const fs = require("fs")

// create client
const client = new Client({
	// intents
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	// partials
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
})

// read the data with pages in it
datastacks = {
	pcba: Object.fromEntries(
		JSON.parse(fs.readFileSync("datastack/pcba.json")).mediawiki.page.map(
			(item) => [item.title, item.revision.text.__text],
		),
	),
}

// get the number of pages in datastacks
function datastacksLength() {
	datastackL = 0 // initializes the datastack length variable
	// add the length of each datastack
	for (const item in datastacks) {
		datastackL += Object.keys(datastacks[item]).length
	}
	return datastackL // return the final length
}

datastack = { ...datastacks.pcba } // merging in datastacks into one

matching2 = new RegExp(/^(<@!857930700267585546>|<@857930700267585546>)/) // regex for detecting mentions

client.on("ready", () => {
	console.log(`serving ${datastacksLength()} pages`) // print the number of pages after the bot is ready
})

// function that sends a reply if a match is found
function sendReply(page, message, stack = datastack) {
	page.split(".").slice(0, -1).join(".") // does something about the file extension
	fs.writeFileSync("./requestfiles/" + page + ".txt", stack[page]) // writes the file into ./requestfiles
	// sends the message along with the attachment
	message.channel.send({
		content: `<@${message.author.id}>`, // pings the author of the request
		files: ["./requestfiles/" + page + ".txt"], // attaches the file
	})
}

// function that sends error message
function errorReply(text, message) {
	// sends error message
	message.channel.send({
		content: `<@${message.author.id}> ${text}`,
	})
}

// function that pings the creator when the bot is used incorrectly
function sendHelp(message) {
	// ping author
	message.channel.send({
		content: `<@689266708044841035> write the documentation`,
	})
}

// check if there's more than 4 matches and if so add "..." at the end
function uselessFunctionThatIWillUseOnce(items) {
	// check if there's more than 4 items
	if (items.length > 4) {
		items[4] = items[4] + "..." // add "..." at the end
		return items // return items
	} else {
		return items // return items
	}
}

// when a message is received
client.on("messageCreate", (message) => {
	// check if it's from a bot and if so, return
	if (message.author.bot) return
	// check if it contains metion of the bot
	if (message.content.match(matching2)) {
		// check if the message can be split by "
		if (message.content.split('"')[1]) {
			requestedPage = message.content.split('"')[1] // gets the requested page
			requestedStack = false // assumes no specific stack is requested
			// check if a specific stack is requested and sets it
			if (
				message.content.split('"').length > 2 && // check if there's more than two "
				message.content.split('"')[2].trim() != "" // check if second argument is empty
			) {
				requestedStack = message.content.split('"')[2].trim() // sets the specific stack
			}
			// if there is a specific task requested
			if (requestedStack) {
				// check if it's a valid stack
				if (datastacks[requestedStack]) {
					// check if the page is in the datastack
					if (datastacks[requestedStack][requestedPage]) {
						sendReply(requestedPage, message, datastacks[requestedStack]) // send back the page
					} else {
						// searches for the page
						possibilities = [] // initializes the possibilities array
						// check if the requested page is longer than 4 characters and if so, searches for it
						if (requestedPage.length > 4) {
							var replace = `(?=.*${requestedPage.replace(" ", ")(?=.*")}).+` // the regex for searching the page
							var re = new RegExp(replace, "i") // initializes the regex
							// searches for the page in the specific stack and saves first 5 matches into the possibilities array
							possibilities = Object.keys(datastacks[requestedStack]) // get all keys from the specific datastack as an array
								.filter((item) => item.match(re)) // filter out the keys that don't match
								.slice(0, 5) // save only first 5 matches
						}
						// check if there are any matches
						if (possibilities.length > 0) {
							// send message listing the possibilities
							message.channel.send({
								// content of the message
								content: `<@${
									// ping who made the original request
									message.author.id
								}> entries similar to ${requestedPage} in datastack \`${requestedStack}\`:\n\`${uselessFunctionThatIWillUseOnce(
									// list the matches
									possibilities,
								).join("\n")}\``,
							})
						} else {
							// sends error message
							errorReply(
								`entry \`${requestedPage}\` wasn't found in datastack \`${requestedStack}\``,
								message,
							)
						}
					}
				} else {
					// searches for the datastack
					var replace = `(?=.*${requestedStack.replace(" ", ")(?=.*")}).+` // the regex for searching the datastack
					var re = new RegExp(replace, "i") // initializes the regex
					// searches for the page in the specific stack and saves first 5 matches into the possibilities array
					possibilities = Object.keys(datastacks) // get all keys from the specific datastack as an array
						.filter((item) => item.match(re)) // filter out the keys that don't match
						.slice(0, 5) // save only first 5 matches
					// check if there are any matches
					if (possibilities.length > 0) {
						// send message listing the possibilities
						message.channel.send({
							// content of the message
							content: `<@${
								// ping who made the original request
								message.author.id
							}> datastacks similar to ${requestedStack}:\n\`${uselessFunctionThatIWillUseOnce(
								// list the matches
								possibilities,
							).join("\n")}\``,
						})
					} else {
						// sends error message
						errorReply(`datastack \`${requestedStack}\` wasn't found`, message)
					}
				}
			} else {
				// check if the page is in the merged datastack
				if (datastack[requestedPage]) {
					// send the page
					sendReply(requestedPage, message, datastack)
				} else {
					// searches for the page
					possibilities = [] // initializes the possibilities array
					// check if the requested page is longer than 4 characters and if so, searches for it
					if (requestedPage.length > 4) {
						var replace = `(?=.*${requestedPage.replace(" ", ")(?=.*")}).+` // the regex for searching the page
						var re = new RegExp(replace, "i") // initializes the regex
						// searches for the page in the specific stack and saves first 5 matches into the possibilities array
						possibilities = Object.keys(datastack) // get all keys from the specific datastack as an array
							.filter((item) => item.match(re)) // filter out the keys that don't match
							.slice(0, 5) // save only first 5 matches
					}
					// check if there are any matches
					if (possibilities.length > 0) {
						// send message listing the possibilities
						message.channel.send({
							// content of the message
							content: `<@${
								// ping who made the original request
								message.author.id
							}> entries similar to ${requestedPage}:\n\`${uselessFunctionThatIWillUseOnce(
								// list the matches
								possibilities,
							).join("\n")}\``,
						})
					} else {
						// sends error message
						errorReply(`entry \`${requestedPage}\` wasn't found`, message)
					}
				}
			}
		} else if (message.content.split(">")[1]) {
			// i forgor 💀
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
			// sends help
			sendHelp(message)
		}
	}
})

client.login(login.token) // log in the bot

var bot = require("nodemw")
// pass configuration object
var client = new bot({
	protocol: "https", // Wikipedia now enforces HTTPS
	server: "polcompball.fandom.com", // host name of MediaWiki-powered site
	path: "", // path to api.php script
	debug: false, // is more verbose when set to true
	username: "Vizdun",
	password: "password",
})

client.logIn(client.username, client.password, (err, data) => {
	console.log(data)
})

/*client.getPagesInNamespace(0, function (err, data) {
  console.log(data)
})

client.whoami((err, data) => {
	console.log(data)
})*/

var cli = require("./cli/cli-api.js");
var passport = require("./api/passport.js");
var chalk = require("chalk");
cli.auth.getFullLogin(function(result) {
	console.log(passport.auth.login(result.email, result.password, function(err, res, body) {
		if(err) {
			console.log(chalk.bgRed("ERROR: ") + chalk.red(err));
		}
		console.log(res)
		console.log(body)
	}))
})


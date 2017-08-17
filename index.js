var cli = require("./cli/cli-api.js");
var passport = require("./api/passport.js");
var chalk = require("chalk");
var token = null

cli.menus.home();

/*
cli.auth.getFullLogin(function(result) {
	console.log(passport.auth.login(result.email, result.password, function(err, res, body) {
		if(err) {
			console.log(chalk.bgRed("ERROR: ") + chalk.red(err));
		} else {	
			token = body.token;

		}

	}))
})*/


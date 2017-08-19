/*
MIT License

Copyright (c) 2017 Joseph Hassell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
//guided menus
var inquirer = require('inquirer');
var chalk = require("chalk");
var Spinner = require("cli-spinner").Spinner;
var passport = require("../api/passport.js");
inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

exports.home = function(done) {
	var question = [
		{
	      name: 'navigation',
	      type: 'list',
	      message: 'Choose an Action:',
	      choices: ["Create a Permission Key For Accounts", new inquirer.Separator(), "Logout/Exit"]
	    }
	];
	if(typeof done == "function") {
		inquirer.prompt(question).then(done);
	} else {
		inquirer.prompt(question).then(function(result) {
			switch(result.navigation) {
				case "Create a Permission Key For Accounts":
					exports.accountPermissionKey(function() {

					})
					break;
				case "Logout/Exit":
					console.log(chalk.green("Goodbye!"))
					break;
			}
		});
	}	
}


exports.promptHome = function(done) {
	exports.home();
}

exports.accountPermissionKey = function(done) {
	var data = {};
	data.permissions = {};
	data.timeout = {};
	var spinner = new Spinner('Loading User Groups.. %s');
	spinner.setSpinnerString('|/-\\');
	spinner.start();
	passport.server.userGroups(function(err, res) {
		if(err) {
			spinner.stop(false);
			return console.error(chalk.bgRed("ERROR: ") + chalk.red(err));
		}
		spinner.stop(false);
		var uG = Object.keys(res.body)
		var questions = [
			{
		      name: 'userGroups',
		      type: 'checkbox',
		      message: 'Choose a User Group:',
		      choices: uG
		    },
		    {
		    	name: 'expiration',
		        type: 'list',
		    	message: 'How do you want it to expire?',
		      	choices: ["Tally", "Date/Time"]
		    }

		];
		inquirer.prompt(questions).then(function(result) {
			data.permissions.userGroups = result.userGroups;
			data.parms = {};
			switch(result.expiration) {
				case "Tally":
					tallyQuestions(function(tally) {
						data.timeout.tally = tally;
						sendData(data);
					})
					break;
				case "Date/Time":
					datetimeQuestions(function(date) {
						data.timeout.time = date;
						sendData(data);
					});
					break;
			}
		});
	});

	function tallyQuestions(done) {
		var tallyQuestions = [
			{
		      name: 'tally',
		      type: 'input',
		      message: 'How many times can this key be used:',
		      validate: function( value ) {
		        if (value.length && !isNaN(parseInt(value))) {
		          return true;
		        } else {
		          return 'Please enter a number';
		        }
		      }
		    }
		];
		inquirer.prompt(tallyQuestions).then(function(result) {
			return done(parseInt(result.tally));
		})
	}
	function datetimeQuestions(done) {
		var dtQ = [
			{
			  type: 'datetime',
			  name: 'dt',
			  message: 'When would you like a table?',
			  format: ['d', '-', 'm', '-', 'yyyy', ' ', 'h', ':', 'MM', ' ', 'TT'],
			  time: {
			    minutes: {
			      interval: 15
			    }
			  }
			}
		];
		inquirer.prompt(dtQ).then(function(result) {
			return done(result);
		})

	}
	function sendData(data) {
		
		var spinner = new Spinner('Generating Key.. %s');
		spinner.setSpinnerString('|/-\\');
		spinner.start();
		passport.security.newPermissionKey(data, function(err, res) {
			spinner.stop();
			if(err) {
				console.error(chalk.bgRed("ERROR: ") + chalk.red(err));
				exports.promptHome();
			} else if(res.code == 201) {
				console.log(chalk.bgGreen.black("Key Created!"));
				console.log(chalk.bgBlue.black("Useful Info:"))
				console.log(chalk.green("	- Your New Key: " + res.body.key))
				console.log(chalk.green("	- Account Signup Link:"), chalk.blue("YOUR DOMAIN HERE TODO/auth/signup?pk=" + res.body.key) );
				exports.promptHome();
			} else {
				console.error(chalk.bgRed("ERROR: ") + chalk.red("Expected 201, got " + res.code));

				exports.promptHome();
			}
			//if(res.stst)
		});
	}
}
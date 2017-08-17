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

}

exports.accountPermissionKey = function(done) {
	var data = {};
	data.permissions = {};
	data.parms = {};
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
			switch(result.expiration) {
				case "Tally":
					tallyQuestions(function(tally) {
						data.timeout.tally = tally;
					})
					break;
				case "Date/Time":
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
}
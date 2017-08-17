//guided menus
var inquirer = require('inquirer');

exports.home = function(done) {
	var question = [
		{
	      name: 'navigation',
	      type: 'list',
	      message: 'Choose an Action:',
	      choices: ["Create a Permission Key", new inquirer.Separator(), "Logout/Exit"]
	    }
	];
	if(typeof done == "function") {
		inquirer.prompt(question).then(done);
	} else {
		inquirer.prompt(question).then(function(result) {
			console.log(result)
		});
	}	
}


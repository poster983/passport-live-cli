var inquirer = require('inquirer');
exports.getFullLogin = function(callback) {
  var questions = [
    {
      name: 'email',
      type: 'input',
      message: 'Enter your Passport Email Address:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your e-mail address';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}


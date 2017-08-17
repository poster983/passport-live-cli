var request = require("request");
var config = require("config");
exports.login = function(email, password, done) {
	request.post(config.get("passportURL") + "/api/auth/login", {form: {email: email, password: password}}, function(err, res, body) {
		if(err) {
			return done(err);
		}
		return done(null, res, body);
	})
}


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
var request = require("request");
var db = require("../../db.js");

exports.login = function(email, password, done) {
	request.post(db.get.serverUrl() + "/api/auth/login", {form: {email: email, password: password}}, function(err, res, body) {
		if(err) {
			return done(err);
		}
		console.log(res.statusCode)
		if(res.headers.errormessage) {
			var err = new Error(res.headers.errormessage);
			err.status = res.statusCode;
			return done(err)
		} else if(res.statusCode == 401) {
			var err = new Error("Unauthorized");
			err.status = res.statusCode;
			return done(err)
		}
		//console.log(body)
		return done(null, JSON.parse(body));
	})
}


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
const low = require('lowdb')
const FileSync = require('./node_modules/lowdb/adapters/FileSync')
const adapter = new FileSync('./userData/db.json')
const db = low(adapter)
const uuidv4 = require("uuid/v4");

db.defaults({ auth: {}, user: [], server: {url: null} })
  .write()

exports.get = {};
exports.set = {};
exports.low = db;

exports.set.JWT = function(jwt) {
	console.log("write")
	db.set('auth.token', jwt).write();
}
exports.get.JWT = function() {
	return db.get('auth.token').value();
}

exports.set.user = function(userId, email) {
	db.get('user')
	  .push({ id: uuidv4(), email: email, userId: userId})
	  .write()
}

exports.get.serverUrl = function() {
	return db.get('server.url').value();
}

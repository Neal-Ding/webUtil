var area = [{
		"name": "浙江省",
		"code": "0",
		"child": [{
			"name": "杭州市",
			"code": "01",
			"child": [{
				"name": "西湖区",
				"code": "0101"
			}, {
				"name": "上城区",
				"code": "0102"
			}]
		}, {
			"name": "宁波市",
			"code": "02",
			"child": [{
				"name": "海曙区",
				"code": "0201"
			}, {
				"name": "鄞州区",
				"code": "1102"
			}]
		}]
	}, {
		"name": "陕西省",
		"code": "1",
		"child": [{
			"name": "西安市",
			"code": "11",
			"child": [{
				"name": "西门",
				"code": "1101"
			}, {
				"name": "东门",
				"code": "1102"
			}]
		}]
	}, {
		"name": "北京",
		"code": "2"
	}
];

function _find(json, target, all) {
	var tKey = target.key,
		tValue = target.value,
		result = [],
		resultItem,
		type;
	for (var i in json) {
		if (json[i][tKey] == tValue) {
			if(all){
				result.push(json[i]);
			}
			else{
				return json[i];
			}
		} else {
			type = Object.prototype.toString.call(json[i]);
			if (type == "[object Object]" || type == "[object Array]") {
				resultItem = _find(json[i], target);
				if(resultItem.toString() !== ''){
					if(all){
						result.push(resultItem);
					}
					else{
						return resultItem;
					}
				}
			}
		}
	}
	return result;
}

function findOne (json, target) {
	return _find(json, target, false);
}

function findAll (json, target) {
	return _find(json, target, true);
}

findOne(area, {key: 'name', value: '海曙区'});

findAll(area, {key: 'code', value: '1102'});
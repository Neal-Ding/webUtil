(function () {
	'use strict';

	var defaultRule = {		//todo 内建规则
		'digit': /\d/,
		'word': /\w/
	};

	var validNodeList = [],
		validStatus = {};

    /**
     * 统一传入对象转为数组
     * @param  {object} selector 选择器，支持原生对象和jQuery实例
     */
    function easyObj (selector) {
        var obj = [];

        if (this.jQuery && selector instanceof this.jQuery) {
        	obj = selector.get();
        } else if (selector.nodeType === 1) {
        	obj = [selector];
        } else if (Object.prototype.toString.call(selector) === '[object NodeList]') {
        	obj = Array.prototype.slice.call(selector);
        }

        return obj;
    }

	/**
	 * 加入待验证元素
	 * @param {[Node|NodeList|jQuery]} node 待验证节点
	 */
	function addItem (target) {
		//concat will return a new Array, push won't
		Array.prototype.push.apply(validNodeList, easyObj(target));
	}

	function removeItem (target) {
		easyObj(target).forEach(function (t) {
			var targetIdx = validNodeList.indexOf(t);

			if (targetIdx > -1) {
				validNodeList.splice(targetIdx, 1);
			}
		});
	}

	function valid (obj) {
		// body...
	}
	var validator = {
		addItem: addItem,
		removeItem: removeItem,
		valid: function (node) {
			valid(node);
		},
		validAll: function () {
			valid(nodeList);
		}
	}

	this.validator = validator;
}).call(this);



function a () {
	var hidden = 'test';
	function b() {
		console.log(arguments.callee.caller);
	}
	b()
}
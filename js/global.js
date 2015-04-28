//全局公用逻辑
var G = {
    init: function () {
        var w = this;

        w.initTip();
    },
    initTip: function () {
        var w = this,
            tipTemplate = '<div class="G-tipMsg"></div>';

        w.tipMsg = w.setTemplate(tipTemplate);
        document.body.appendChild(w.tipMsg);
    },
    ns: function (str, overWritten) {
        var arr = str.split("."),
            win = window,
            w = this;

        arr.forEach(function (t) {
            if(win[t] === undefined || overWritten){
                win[t] = {};
            }
            else if(w.isObject(win[t])){
                return true;
            }
            else {
                console.log(JSON.stringify(win[t]) + " will be overWritten");
                return false;
            }
            win = win[t];
        });
    },
    isObject: function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Object]') ? true : false;
    },
    easyObj: function (selector) {
        var obj = (this.jQuery && selector instanceof this.jQuery) ? selector.get() :
            (selector.nodeType === 1) ? [selector] :
            (Object.prototype.toString.call(selector) === '[object NodeList]') ? Array.prototype.slice.call(selector) : [];
        return obj;
    },
    //兼容模板内容，单节点和多节点
    //todo
    //返回collection还是nodelist 比较好？目前是collection
    setTemplate: function (input) {
        var w = this,
            tempDOM = document.createElement('div'),
            template;

        if(typeof(input) === 'string'){
            tempDOM.innerHTML = input;
        }
        else if(input !== undefined){
            input = w.easyObj(input);
            input.forEach(function (t) {
                tempDOM.innerHTML += t.innerHTML;
            });
        }

        template = (tempDOM.children.length > 1) ? tempDOM.children : tempDOM.children[0];
        return template;
    },
    showTip: function (text, status) {
        var w = this,
            statusArr = ['pass', 'warn', 'error'];

        w.tipMsg.innerHTML = text || '';
        DOMTokenList.prototype.remove.apply(w.tipMsg.classList, statusArr);
        w.tipMsg.classList.add(statusArr[status], 'show');
        setTimeout(function () {
            w.tipMsg.classList.remove('show');
        }, 1000);
    },
    share: {
        showPassTip: function (text) {
            G.showTip(text, 0);
        },
        showWarnTip: function (text) {
            G.showTip(text, 1);
        },
        showErrorTip: function (text) {
            G.showTip(text, 2);
        }
    }
};
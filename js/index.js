//全局公用逻辑
var G = {
    init: function () {
        var w = this;
        w.tipMsg = document.querySelector('.G-tipMsg');
    },
    ns: function (str, overWritten) {
        var arr = str.split("."),
            w = window;

        for (var i = 0; i < arr.length; i++) {
            if(w[arr[i]] === undefined || overWritten){
                w[arr[i]] = {};
            }
            else {
                console.log(JSON.stringify(w[arr[i]]) + " will be overWritten");
                break;
            }
            w = w[arr[i]];
        }
    },
    //兼容模板内容，单节点和多节点
    //todo
    //返回元素是否必须用tempDOM中转？参考下handlebars和underscore
    //返回collection还是nodelist 比较好？目前是collection
    //目前是根据节点数量返回单一节点或者是collection, 是否有必要？
    setTemplate: function (input) {
        var tempDOM = document.createElement('div'),
            template;

        if(typeof(input) === 'string'){
            tempDOM.innerHTML = input;
        }
        else if(input !== undefined){
            input = (input.nodeType === 1) ? [input] : Array.prototype.slice.call(input);
            input.forEach(function (t) {
                tempDOM.innerHTML += t.innerHTML;
            });
        }

        template = (tempDOM.children.length > 1) ? tempDOM.children : tempDOM.children[0];
        return template;
    },
    share: {
        showPassTip: function (text) {
            var w = this;
            w._showTip(text, 0);
        },
        showWarnTip: function (text) {
            var w = this;
            w._showTip(text, 1);
        },
        showErrorTip: function (text) {
            var w = this;
            w._showTip(text, 2);
        },
        _showTip: function (text, status) {
            var w = this,
                tipMsg = w.tipMsg,
                tipTemplate = '<div class="G-tipMsg"></div>',
                statusArr = ['pass', 'warn', 'error'];

            if(!tipMsg){
                tipMsg = G.setTemplate(tipTemplate);
                document.body.appendChild(tipMsg);
            }
            tipMsg.innerText = text || '';
            DOMTokenList.prototype.remove.apply(tipMsg.classList, statusArr);
            setTimeout(function () {
                tipMsg.classList.add(statusArr[status], 'show');
            }, 0);
            setTimeout(function () {
                tipMsg.classList.remove('show');
            }, 1000);
        }
    }
};

//处理拖拽逻辑
G.drag = {
    init: function (request, response) {
        var w = this;

        ZeroClipboard.config({
            moviePath: 'js/ZeroClipboard.swf',
            handCursorEnabled: true,
            hoverClass: 'status-hover',
            trustedDomains: ['*']
        });

        w.src = request.source;
        w.tip = request.source.children[0];
        w.res = response;
        w.tpl = request.template;
        w.eventHandle();
    },
    eventHandle: function () {
        var w = this;

        w.src.addEventListener('dragenter', w.dragEnterHandle, false);
        w.src.addEventListener('dragover', w.dragEnterHandle, false);
        w.src.addEventListener('dragleave', w.dragLeaveHandle, false);
        w.src.addEventListener('drop', w.dropHandle, false);
    },
    dragEnterHandle: function (e) {
        var w = G.drag;

        e.preventDefault();
        if(e.dataTransfer.types[0] === "Files"){
            w.setAreaStatus(1);
        }
    },
    dragLeaveHandle: function (e) {
        var w = G.drag;

        e.preventDefault();
        w.setAreaStatus(0);
    },
    dropHandle: function (e) {
        var files = Array.prototype.slice.call(e.dataTransfer.files),
            docfrag = document.createDocumentFragment(),
            w = G.drag;

        e.preventDefault();
        w.setAreaStatus(2);
        files.forEach(function (t) {
            if(t.type.indexOf('image') != -1){
                var item = G.setTemplate(w.tpl);
                G.reader.init(t, item);
                docfrag.appendChild(item);
            }
        });
        w.res.appendChild(docfrag);
        w.setAreaStatus(0);
    },
    setAreaStatus: function (status) {
        var tipArr = ['将图片拖拽至此', '释放生成DataURL', '处理中...', '只接受图片类文件'],
            w = G.drag;

        w.tip.innerText = tipArr[status];
    }
};

//读取数据逻辑
G.reader = {
    init: function (file, itemNode) {
        var w = this,
            reader = new FileReader();

        w.file = file;
        w.itemNode = itemNode;

        reader.imgNode = w.itemNode.querySelector('.img');
        reader.copyNode = w.itemNode.querySelector('.copy');
        reader.statusNode = w.itemNode.querySelector('.status');

        w.eventHandle(reader);
    },
    eventHandle: function (reader) {
        var w = this;

        reader.onloadstart = w.onloadStart;
        reader.onload = w.onload;
        reader.readAsDataURL(w.file);
    },
    onloadStart: function () {
        var t = this,
            w = G.reader;

        w.setStatus(t.statusNode, t.readyState);
    },
    onload: function () {
        var t = this,
            w = G.reader;

        t.imgNode.src = t.result;
        w.setStatus(t.statusNode, t.readyState);
        //todo
        //节点委托
        w.setClipBoard(t.copyNode);
    },
    setStatus: function (node, status) {
        if(status == 2){
            node.style.height = 0;
        }
    },
    setClipBoard: function (btn) {
        var copy = new ZeroClipboard(btn);

        copy.on('load', function(client) {
            client.on('datarequested', function(client) {
                client.setText(this.previousElementSibling.src);
            });
            client.on('complete', function() {
                G.share.showPassTip('复制成功');
            });
        });
        copy.on('wrongflash noflash', function() {
            ZeroClipboard.destroy();
        });
    }
};

window.onload = function () {
    // todo
    // base64切割输出带进度，保证大图不卡，BUT 切割后无法组装回DataURL，目前无解
    var request = {
            source: document.querySelector('.img-area'),
            template: document.querySelectorAll('.code-list-template')
        },
        response = document.querySelector('.code-list');

    G.init();
    G.drag.init(request, response);
};
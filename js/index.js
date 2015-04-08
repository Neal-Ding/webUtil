//全局公用逻辑
var G = {
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
    share: {
        showPassTip: function (text) {
            var t = this;
            t._showTip(text, 0);
        },
        showWarnTip: function (text) {
            var t = this;
            t._showTip(text, 1);
        },
        showErrorTip: function (text) {
            var t = this;
            t._showTip(text, 2);
        },
        _showTip: function (text, status) {
            var tipMsg = document.querySelector('.G-tipMsg'),
                statusArr = ['pass', 'warn', 'error'];

            if(!tipMsg){
                tipMsg = document.createElement("div");
                tipMsg.className = 'G-tipMsg';
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
    init: function (req, res) {
        var t = this;

        ZeroClipboard.config({
            moviePath: 'js/ZeroClipboard.swf',
            handCursorEnabled: true,
            hoverClass: 'status-hover',
            trustedDomains: ['*']
        });

        t.req = req;
        t.res = res;
        t.eventHandle();
    },
    eventHandle: function () {
        var t = this;

        t.req.addEventListener('dragenter', t.dragEnterHandle, false);
        t.req.addEventListener('dragover', t.dragEnterHandle, false);
        t.req.addEventListener('dragleave', t.dragLeaveHandle, false);
        t.req.addEventListener('drop', t.dropHandle, false);
    },
    dragEnterHandle: function (e) {
        var w = G.drag;

        e.preventDefault();
        if(e.dataTransfer.files.length > 0){
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
                var item = document.createElement('li');
                item.innerHTML =
                '<img alt="img" class="img">' +
                '<button class="copy">复制编码</button>' +
                '<span class="status"></span>';
                docfrag.appendChild(item);

                G.reader.init(t, item);
            }
        });
        w.res.appendChild(docfrag);
        w.setClipBoard(document.querySelectorAll('.copy'));
        w.setAreaStatus(0);
    },
    setAreaStatus: function (status) {
        var tipArr = ['将图片拖拽至此', '释放生成DataURL', '处理中...'],
            w = G.drag;

        w.req.children[0].innerText = tipArr[status];
    },
    setClipBoard: function (btn) {
        var copy = new ZeroClipboard(btn);
        copy.on('load', function(client) {
            client.on('datarequested', function(client) {
                client.setText(this.previousSibling.src);
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

//读取数据逻辑
G.reader = {
    init: function (file, itemNode) {
        var t = this;

        t.itemNode = itemNode;
        t.file = file;

        t.eventHandle();
    },
    eventHandle: function () {
        var t = this,
            reader = new FileReader();

        reader.itemNode = t.itemNode;
        reader.onloadstart = t.onloadStart;
        reader.onload = t.onload;
        reader.readAsDataURL(t.file);
    },
    onloadStart: function () {
        var t = this,
            w = G.reader;

        w.setStatus(t.itemNode, 1);
    },
    onload: function () {
        var t = this,
            w = G.reader;

        t.itemNode.querySelector('.img').src = t.result;
        w.setStatus(t.itemNode, 2);
    },
    setStatus: function (obj, status) {
        if(status == 2){
            obj.querySelector('.status').style.height = 0;
        }
    }
};

window.onload = function () {
    // todo
    // base64切割输出带进度，保证大图不卡，BUT 切割后无法组装回DataURL，目前无解
    var request = document.querySelector('.img-area'),
        response = document.querySelector('.code-list');

    G.drag.init(request, response);
};
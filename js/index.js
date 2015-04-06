//全局公用逻辑
var global = {
    share: {
        showTipMsg: function (text, status) {
            var tipMsg = document.querySelector('.tipMsg'),
                bgColor = ['red', 'orange', 'green'];
            tipMsg.style.backgroundColor = bgColor[status || 1];
            tipMsg.style.margin = '0';
            tipMsg.innerText = text || '';
            setTimeout(function () {
                tipMsg.style.margin = '-50px 0 0 0';
            }, 1000);
        }
    }
};

//处理拖拽逻辑
global.drag = {
    init: function (imgArea) {
        var t = this;

        ZeroClipboard.config({
            moviePath: 'js/ZeroClipboard.swf',
            handCursorEnabled: true,
            hoverClass: 'status-hover',
            trustedDomains: ['*']
        });

        t.imgArea = imgArea;
        t.eventHandle();
    },
    eventHandle: function () {
        var t = this;

        t.imgArea.addEventListener('dragenter', t.dragEnterHandle, false);
        t.imgArea.addEventListener('dragover', t.dragEnterHandle, false);
        t.imgArea.addEventListener('dragleave', t.dragLeaveHandle, false);
        t.imgArea.addEventListener('drop', t.dropHandle, false);
    },
    dragEnterHandle: function (e) {
        var w = global.drag;

        e.preventDefault();
        if(e.dataTransfer.files.length > 0){
            w.setAreaStatus(1);
        }
    },
    dragLeaveHandle: function (e) {
        var w = global.drag;

        e.preventDefault();
        w.setAreaStatus(0);
    },
    dropHandle: function (e) {
        var files = Array.prototype.slice.call(e.dataTransfer.files),
            codeList = document.querySelector('.code-list'),
            docfrag = document.createDocumentFragment(),
            w = global.drag;

        e.preventDefault();
        files.forEach(function (t) {
            if(t.type.indexOf('image') != -1){
                var item = document.createElement('li');
                item.innerHTML = 
                '<img alt="img" class="img">' +
                '<button class="copy">复制编码</button>' +
                '<span class="status"></span>';
                docfrag.appendChild(item);

                global.reader.init(t, item);
            }
        });
        codeList.appendChild(docfrag);
        w.setClipBoard(document.querySelectorAll('.copy'));
        w.setAreaStatus(0);
    },
    setAreaStatus: function (status) {
        var tipArr = ['将图片拖拽至此', '释放生成DataURL', '处理中...'],
            w = global.drag;

        w.imgArea.children[0].innerText = tipArr[status];
    },
    setClipBoard: function (btn) {
        var copy = new ZeroClipboard(btn);
        copy.on('load', function(client) {
            client.on('datarequested', function(client) {
                client.setText(this.previousSibling.src);
            });
            client.on('complete', function() {
                global.share.showTipMsg('复制成功', 2);
            });
        });
        copy.on('wrongflash noflash', function() {
            ZeroClipboard.destroy();
        });
    }
};

//读取数据逻辑
global.reader = {
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
            w = global.reader;

        w.setStatus(t.itemNode, 1);
    },
    onload: function () {
        var t = this,
            w = global.reader;

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
    var imgArea = document.querySelector('.img-area');

    global.drag.init(imgArea);
};
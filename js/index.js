G.ns('Page.drag');
G.ns('Page.reader');

//处理拖拽逻辑
Page.drag = {
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
        var w = Page.drag;

        e.preventDefault();
        if(e.dataTransfer.types[0] === "Files"){
            w.setAreaStatus(1);
        }
    },
    dragLeaveHandle: function (e) {
        var w = Page.drag;

        e.preventDefault();
        w.setAreaStatus(0);
    },
    dropHandle: function (e) {
        var files = Array.prototype.slice.call(e.dataTransfer.files),
            docfrag = document.createDocumentFragment(),
            w = Page.drag;

        e.preventDefault();
        w.setAreaStatus(2);
        files.forEach(function (t) {
            if(t.type.indexOf('image') != -1){
                var item = G.setTemplate(w.tpl);
                Page.reader.init(t, item);
                docfrag.appendChild(item);
            }
        });
        w.res.appendChild(docfrag);
        w.setAreaStatus(0);
    },
    setAreaStatus: function (status) {
        var tipArr = ['将图片拖拽至此', '释放生成DataURL', '处理中...', '只接受图片类文件'],
            w = Page.drag;

        w.tip.innerText = tipArr[status];
    }
};

//读取数据逻辑
Page.reader = {
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
            w = Page.reader;

        w.setStatus(t.statusNode, t.readyState);
    },
    onload: function () {
        var t = this,
            w = Page.reader;

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
    // 参考API: https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
    var request = {
            source: document.querySelector('.img-area'),
            template: document.querySelectorAll('.code-list-template')
        },
        response = document.querySelector('.code-list');

    G.init();
    Page.drag.init(request, response);
};
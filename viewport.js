(function(win) {
    var docEl = document.documentElement;
    var metaEl = document.querySelector('meta[name="viewport"]');
    var fontEl = document.createElement('style'),
            dpr,scale,tid;

    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=(["']?)([\d\.]+)\1?/);
        if (match) {
            scale = parseFloat(match[2]);
            dpr = 1 / scale;
        }
    }
    if (!dpr && !scale) {
        dpr = win.devicePixelRatio || 1;
        scale = 1 / dpr;
    }
    docEl.setAttribute('data-dpr', dpr);
    docEl.firstElementChild.appendChild(fontEl);
    if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        var matches = navigator.userAgent.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i);
        //matches 为空代表是iOS设备
        //matches[1] > 534代表是Android4.4以上系统 http://jimbergman.net/webkit-version-in-android-version/
        //4.4以下的机型，（AppleWebkit/534）下会出现闪屏现象，原因是target-densitydpi=device-dpi导致，会导致先显示整个分辨率的大小，再缩小原来的普通的。页面是scale=1的，当切换到此0.5方案的页面时534以下的webkit会有缩放的过程。
        if(!matches || matches && matches[1] > 534) {
            metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale);
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                var wrap = document.createElement('div');
                wrap.appendChild(metaEl);
                document.write(wrap.innerHTML);
            }

            //hack vivo、云os等非主流设备
            //设置viewport后，viewport还是默认的980||1024，重新设置viewport，
            //通过target-densitydpi=device-dpi,width=device-width,user-scalable=no可以真正改变viewport的值为其真实设备的值
            //不通过加入具体设备的白名单，通过此特征检测 docEl.clientWidth == 980
            //initial-scale=1,maximum-scale=1,minimum-scale=1不能省，因为上面设置为其他的scale了，需要重置回来

            if(docEl.clientWidth == 980 || docEl.clientWidth == 1024) {
                metaEl.setAttribute('content', 'target-densitydpi=device-dpi,width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1');
            }
            // 其它的Android系统，主要是Android 4.4以下的系统，会出现闪屏现象，所以弄个普通设置好了。
            // 所谓闪屏，是指在4.4以下的Android系统，如果有target-densitydpi=device-dpi 会导致最终docEl.clientWidth为实际的物理像素宽度。
            // 而如果没有target-densitydpi=device-dpi，则最后docEl.clientWidth为ideal layout的 viewport的宽度。
            // 以note2为例，如果没有target-densitydpi=device-dpi，viwport设置完的宽度变化会是320==》360,设置target-densitydpi=device-dpi之后，viwport设置完的宽度变化会是320==>720
        } else {
            metaEl.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1');
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                var wrap2 = document.createElement('div');
                wrap2.appendChild(metaEl);
                document.write(wrap2.innerHTML);
            }
        }
    }

    function includeLinkStyle(url) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.media = "all and (min-device-width:768px) and (min-width:768px)";
        link.href = url;
        document.querySelector("head").appendChild(link);
    }

    function setUnitA(){
        var docWidth = docEl.clientWidth;
        win.rem = 32*docWidth/640;
        //iPad适配,包含非retina的iPad以及retina版的iPad
        if(navigator.userAgent.match(/iPad/i) && docWidth >= 768) {
            win.rem = 32*docWidth/1280;
            includeLinkStyle("../css/ipad2.css?t=3.8.0.94");
        }
        fontEl.innerHTML = 'html{font-size:' + win.rem + 'px!important;}';
    }
    win.dpr = dpr;
    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(setUnitA, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(setUnitA, 300);
        }
    }, false);
    setUnitA();
})(window);
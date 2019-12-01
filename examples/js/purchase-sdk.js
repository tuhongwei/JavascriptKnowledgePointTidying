'use strict';

var PurchaseSDK = function () {
    var token = '' + Date.now();
    var readyCallbackList = [];
    var connected = false;
    var target = null;
    var type = 'from_purchase_panel';
    var sdkAgentUrl = '//abc.360.cn/assets/sdk_agent.html';
    var cache = {};

    function ready(callback) {
        if (connected) {
            callback();
        } else {
            readyCallbackList.push(callback);
        }
    }

    function receiveMessage(event) {
        var data = event.data;
        if (!data) {
            return;
        }
        if (data.token !== token) {
            return;
        }
        if (!data.msg) {
            return;
        }

        switch (data.msg) {
            case 'ping':
                target = event.source;
                sendMessage('pong');
                break;
            case 'connected':
                connected = true;
                while (readyCallbackList.length) {
                    readyCallbackList.pop()();
                }
                break;
            default:
                handleMsg(data.msg);
                break;
        }
    }

    function handleMsg(msg) {
        switch (msg.type) {
            case 'to_purchase_payload':
                console.log('>>> to_purchase_payload');
                console.log(msg.payload);
                if (cache['to_purchase_payload']) {
                    cache['to_purchase_payload'](msg.payload);
                    delete cache['to_purchase_payload'];
                }
                break;
        }
    }

    function sendMessage(msg) {
        if (!target || !ready) {
            logError('尚未同游戏平台未建立链接');
            return;
        }

        target.postMessage({
            'token': token,
            'msg': msg
        }, '*');
    }

    function connect() {
        window.addEventListener("message", receiveMessage, false);
        var frame = document.createElement("iframe");
        frame.setAttribute("style", "display:none");
        document.body.appendChild(frame);
        frame.src = sdkAgentUrl + '?token=' + token + '&type=' + type;

        window.addEventListener("unload", function () {
            if (connected) {
                sendMessage('disconnect');
            }
        }, false);
    }

    function proxy(fn, fnName) {
        return function () {
            var _args = arguments;
            if (connected) {
                fn.apply(null, _args);
            } else {
                ready(function () {
                    fn.apply(null, _args);
                });
            }
        };
    }

    function logError(msg) {
        if (console) {
            console.error && console.error(msg);
        } else if (alert) {
            alert(msg);
        }
    }

    function closePurchasePanel() {
        sendMessage({
            type: 'from_purchase_closePurchasePanel'
        });
    }

    function getPayload(callback) {
        cache['to_purchase_payload'] = callback;

        sendMessage({
            type: 'from_purchase_getPayload'
        });
    }

    function parseSearch() {
        var search = location.search;
        if (search.length > 1) {
            search = search.slice(1);
        }

        var kvArray = search.split("&");
        var kvObj = {};
        kvArray.forEach(function (kv, index) {
            var a = kv.split("=");
            kvObj[a[0]] = decodeURIComponent(a[1]);
        });

        return kvObj;
    }

    function purchaseSuccess(result) {
        sendMessage({
            type: 'from_purchase_result_success',
            result: result
        });
    }

    function purchaseError(error) {
        sendMessage({
            type: 'from_purchase_result_error',
            error: error
        });
    }

    function showPaymentPage(url) {
        sendMessage({
            type: 'show_payment_page',
            url: url
        });
    }

    connect();

    return {
        'closePurchasePanel': proxy(closePurchasePanel, 'closePurchasePanel'),
        'getPayload': proxy(getPayload, 'getPayload'),
        'parseSearch': parseSearch,
        'purchaseSuccess': proxy(purchaseSuccess, 'purchaseSuccess'),
        'purchaseError': proxy(purchaseError, 'purchaseError'),
        'showPaymentPage': proxy(showPaymentPage, 'showPaymentPage')
    };
}();
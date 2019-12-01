'use strict';

var px2rem = function () {
  var bodyStyle;
  var designWidth = 750;
  var maxWidth = /iphone|ipad|android/i.test(navigator.userAgent) ? designWidth : 500;
  var resizeTimeoutId;
  var doc = document.documentElement;
  var v = document;

  function setRootFontSize() {
    var _w = doc.clientWidth || doc.getBoundingClientRect().width;
    var w = Math.min(maxWidth, _w);
    var x = 100 * (w / designWidth);
    doc.style.fontSize = x + 'px';
  }

  function setBodyStyle() {
    if (bodyStyle) {
      bodyStyle.parentNode.removeChild(bodyStyle);
    }

    var i = 'body{max-width:' + maxWidth + 'px; margin: 0 auto;}',
    n = document.createElement('style');
    bodyStyle = n;
    n.type = 'text/css';
    if (n.styleSheet) {
      n.styleSheet.cssText = i;
    } else {
      n.appendChild(document.createTextNode(i));
    }
    s(n);
  }

  function s(x) {
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(x);
  }

  function resizeHandler() {
    /*设置根元素的fontSize*/
    setRootFontSize();
    /* 设置body的最大宽度 */
    setTimeout(function () {
        document.body.setAttribute('style', 'min-height:' + document.documentElement.clientHeight + 'px');
    }, 50);
  }

  function _resizeHandler() {
    clearTimeout(resizeTimeoutId);
    resizeTimeoutId = setTimeout(resizeHandler, 150);
  }

  window.addEventListener('resize', _resizeHandler, false);
  window.addEventListener('pageshow', _resizeHandler, false);
  window.addEventListener('orientationchange', _resizeHandler, false);

  function ready(callback) {
    var readyRE = /complete|loaded|interactive/;
    if (readyRE.test(v.readyState)) {
      v.body.style.fontSize = '12px';
      resizeHandler();
      setBodyStyle();
      callback();
    } else {
      v.addEventListener('DOMContentLoaded', function (w) {
        v.body.style.fontSize = '12px';
        resizeHandler();
        setBodyStyle();
        callback();
      }, false);
    }
  }

  return {
    'ready': ready
  };
}();
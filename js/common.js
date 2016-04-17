/**
 * 说明: 该模块主要用于拓展和封装一些公共方法
 * 
 * 该算法主要实现了一下功能:
 * 
 * 
 * 作者: 尹行欣
 * 日期: 20160416
 */
+function () {
    //添加事件浏览器的兼容性处理
    var eventUtil = {
        //element 事件的元素
        //type 事件的类型
        //handler 事件处理程序的函数

        //添加事件
        addHandler: function (type, handler) {
            DOM.each(this.dom, function (element) {
                // firefox google chrome
                if (element.addEventListener) {
                    element.addEventListener(type, handler, false);
                    // ie
                } else if (element.attachEvent) {
                    element.attachEvent('on' + type, handler);
                    // other
                } else {
                    element['on' + type] = handler;
                }
            });
        },

        //移除事件
        removeHandler: function (type, handler) {
            DOM.each(this.dom, function (element) {
                // firefox google chrome
                if (element.removeEventListener) {
                    element.removeEventListener(type, handler, false);
                    // ie
                } else if (element.detachEvent) {
                    element.detachEvent('on' + type, handler);
                    // other
                } else {
                    element['on' + type] = null;
                }
            });
        },

        //得到event对象
        getEvent: function (event) {
            return event ? event : window.event;
        },

        //取消事件默认行为
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        //取消事件冒泡
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    };


    /**
	 * 
	 * 拓展元素选择器
	 * @param {String} sel 选择字符串
	 * @param {String} context 上下文环境
	 */
    function selector(sel, context) {

        context = context || document;

        var dom = [];

        if (!(typeof sel == 'string')) {
            dom=dom.concat(sel);
            return dom;
        }
        var doms = context.querySelectorAll(sel);
        for (var i = 0; i < doms.length; i++) {
            dom.push(doms[i]);
        }
        return dom;
    }

    // 判断是否拥有某个类名
    function hasClass(cls, e) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        e = e || this.dom[0];
        return e.className ? reg.test(e.className) : false;
    }

    //添加类
    function addClass(cls, e) {
        DOM.each(this.dom, function (e)
        {
            if (!hasClass(cls, e))
            {
                e.className += " " + cls;
            }
        });
    }
    
    //删除类
    function removeClass(cls,e)
    {
        DOM.each(this.dom, function (e) {
            if (hasClass(cls, e)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                e.className = e.className.replace(reg, ' ');
            }
        })
    }
    // 遍历集合元素
    function each(obj, callback)
    {
        for (var e in obj) {
            callback(obj[e], e);
        }
    }

    window.DOM = window.DOM || function (seletor, context) {
        if (this instanceof DOM) {
            this.dom = selector(seletor, context);
            return this;
        } else {
            return new DOM(seletor, context);
        }
    }

    /****************************
	// 拓展静态方法
	/***************************/
    // 遍历对象和数组
    DOM.each = each;

    /****************************
	// 拓展共有方法
	/***************************/
    DOM.prototype.hasClass = hasClass;
    DOM.prototype.addClass = addClass;
    DOM.prototype.removeClass = removeClass;

    /****************************
	// 拓展事件对象
	/***************************/
    DOM.each(eventUtil, function (value, key) {
        DOM.prototype[key] = value;
    });
}();
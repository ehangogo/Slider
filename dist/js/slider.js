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
/**
 * 说明: 该模块主要用于生成slider
 * 
 * 该算法主要实现了一下功能:
 * 
 * 作者: 尹行欣
 * 日期: 20160416
 */

+function () {
    // 轮播对象
    window.Slider = function (context, options) {
        this.context = context;
        this.items = DOM(".item", context).dom;
        this.lis = DOM(".slider-indicators li", context).dom;
        this.prev = DOM(".prev", context).dom;
        this.next = DOM(".next", context).dom;
        //当前显示的图片索引
        this.active = 0;
        //点击的是圆点还是前进后退按钮
        this.clickName = "liClick";
        this.options = options;
        this.sliderEffect = this.options.sliderEffect ? this.options.sliderEffect : 'slide';
        this.slideInterval = this.options.slideInterval ? this.options.slideInterval : 1000;
        //轮播定时器
        this.timer = null;
        this.autoSlide = (typeof this.options.autoSlide == "boolean") ? this.options.autoSlide : true;
        init(this);
    };

    //将slider设置为当前
    function setActiveSlide(slider) {
        this.active = slider;
        if (this.sliderEffect == 'slide') {
            slideEffect(this);
        } else {
            fadeoutEffect(this);
        }
    }

    //设置滑动样式
    function slideEffect(slider) {
        var j = 0;
        //获取当前展示的图片索引
        var flag;
        for (j = 0; j < slider.lis.length; j++) {
            if (DOM(slider.lis[j]).hasClass("active")) {
                flag = j;
                break;
            }
        }
        //与目的图片序号一样，返回即可
        if (flag == slider.active) {
            return;
        }
        else {
            //给下标加上相应的样式
            DOM(slider.lis[flag]).removeClass("active");
            DOM(slider.lis[slider.active]).addClass("active");

            //在正在显示的图片左边，则向左滑动
            if (slider.active < flag) {
                if (slider.clickName == "nextClick" && flag == slider.items.length - 1 && slider.active == 0) {
                    //点击后退按钮，从最后一个到第一个
                    //slider.items[slider.active].style.left = "100%";
                    //slider.items[slider.active].style.display = "block";
                    DOM(slider.items[slider.active]).removeClass("slidemiss");
                    DOM(slider.items[slider.active]).addClass("slideright");
                    // 触发轮播前回调函数
                    slider.sliderWillSlide(flag, slider.active);
                    setTimeout(function () {
                        //slider.items[slider.active].style.left = "0";
                        DOM(slider.items[slider.active]).removeClass("slideright");
                        DOM(slider.items[slider.active]).addClass("slideactive");
                        //slider.items[flag].style.left = "-100% ";
                        DOM(slider.items[flag]).removeClass("slideactive");
                        DOM(slider.items[flag]).addClass("slideleft");
                        setTimeout(function () {
                            //slider.items[flag].style.left = "0";
                            //slider.items[flag].style.display = "none";
                            DOM(slider.items[flag]).removeClass("slideleft");
                            DOM(slider.items[flag]).addClass("slidemiss");
                            // 触发轮播后回调函数
                            slider.sliderDidSlide(slider.active, flag);
                        }, 700);
                    }, 1);
                } else {
                    DOM(slider.items[slider.active]).removeClass("slidemiss");
                    DOM(slider.items[slider.active]).addClass("slideleft");
                    // 触发轮播前回调函数
                    slider.sliderWillSlide(flag, slider.active);
                    setTimeout(function () {
                        DOM(slider.items[slider.active]).removeClass("slideleft");
                        DOM(slider.items[slider.active]).addClass("slideactive");
                        DOM(slider.items[flag]).removeClass("slideactive");
                        DOM(slider.items[flag]).addClass("slideright");

                        setTimeout(function () {
                            DOM(slider.items[flag]).removeClass("slideright");
                            DOM(slider.items[flag]).addClass("slidemiss");
                            // 触发轮播后回调函数
                            slider.sliderDidSlide(slider.active, flag);
                        }, 700);
                    }, 1);

                }
            }
            else {
                if (slider.clickName == "prevClick" && flag == 0 && slider.active == slider.items.length - 1) {
                    //在正在显示的图片右边，则向右滑动
                    DOM(slider.items[slider.active]).removeClass("slidemiss");
                    DOM(slider.items[slider.active]).addClass("slideleft");
                    // 触发轮播前回调函数
                    slider.sliderWillSlide(flag, slider.active);
                    setTimeout(function () {
                        DOM(slider.items[slider.active]).removeClass("slideleft");
                        DOM(slider.items[slider.active]).addClass("slideactive");
                        DOM(slider.items[flag]).removeClass("slideactive");
                        DOM(slider.items[flag]).addClass("slideright");

                        setTimeout(function () {
                            DOM(slider.items[flag]).removeClass("slideright");
                            DOM(slider.items[flag]).addClass("slidemiss");
                            // 触发轮播后回调函数
                            slider.sliderDidSlide(slider.active, flag);
                        }, 700);
                    }, 1);
                } else {
                	DOM(slider.items[slider.active]).removeClass("slidemiss");
                    DOM(slider.items[slider.active]).addClass("slideright");
                    // 触发轮播前回调函数
                    slider.sliderWillSlide(flag, slider.active);
                    setTimeout(function () {
                        DOM(slider.items[slider.active]).removeClass("slideright");
                        DOM(slider.items[slider.active]).addClass("slideactive");
                        DOM(slider.items[flag]).removeClass("slideactive");
                        DOM(slider.items[flag]).addClass("slideleft");
                        setTimeout(function () {
                            DOM(slider.items[flag]).removeClass("slideleft");
                            DOM(slider.items[flag]).addClass("slidemiss");
                            // 触发轮播后回调函数
                            slider.sliderDidSlide(slider.active, flag);
                        }, 700);
                    }, 1);
                }

            }
        }
    }

    //设置淡入淡出的样式
    function fadeoutEffect(slider) {
        var j = 0;
        //获取当前展示的图片索引
        var flag;
        for (j = 0; j < slider.lis.length; j++) {
            if (DOM(slider.lis[j]).hasClass("active")) {
                flag = j;
                break;
            }
        }
        //与目的图片序号一样，返回即可
        if (flag == slider.active) {
            return;
        }
        else {
            //给下标加上相应的样式
            DOM(slider.lis[flag]).removeClass("active");
            DOM(slider.lis[slider.active]).addClass("active");
            //淡出图片

            slider.items[slider.active].style.opacity = "0";
            slider.items[slider.active].style.display = "block";
            //DOM(slider.items[slider.active]).removeClass("fade_out_after");
            //DOM(slider.items[slider.active]).addClass("fade_in_before");
            // 触发轮播前回调函数
            slider.sliderWillSlide(flag, slider.active);
            setTimeout(function () {
                slider.items[slider.active].style.opacity = "1";
                //DOM(slider.items[slider.active]).removeClass("fade_in_before");
                //DOM(slider.items[slider.active]).addClass("fadein");
                //DOM(slider.items[flag]).removeClass("fadein");
                //DOM(slider.items[flag]).addClass("fadeout");
                slider.items[flag].style.opacity = "0 ";
                setTimeout(function () {
                    //DOM(slider.items[flag]).removeClass("fadeout");
                    //DOM(slider.items[flag]).addClass("fade_out_after");
                    slider.items[flag].style.display = "none ";
                    // 触发轮播后回调函数
                    slider.sliderDidSlide(slider.active, flag);
                }, 700);
            }, 1);

        }
    }

    //将要slide的时候调用的方法，传递参数:当前slide,将要出现的slide
    function sliderWillSlide(now, next) {

        var curSlider = this.items[now];
        curSlider.index = now;
        var nextSlider = this.items[next];
        nextSlider.index = next;

        this.trigger('willslide', curSlider, nextSlider);
    }
    //slide结束的时候触发,传递参数:当前slide,上一个slide
    function sliderDidSlide(now, prev) {

        var curSlider = this.items[now];
        curSlider.index = now;
        var prevSlider = this.items[prev];
        prevSlider.index = prev;

        this.trigger('didslide', curSlider, prevSlider);
    }
    //添加事件
    function on(type, callback) {
        if (type && callback) {
            this.events = this.events || {};
            this.events[type] = this.events[type] ? this.events[type].concat(callback) : [].concat(callback);
        }
    }
    // 触发事件
    function trigger(type) {
        var callbacks = this.events ? this.events[type] : undefined;
        if (callbacks) {
            for (var i in callbacks) {
                callbacks[i].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }

    // 得到轮播图的Dom对象
    function getSlideByIndex(index) {
        return this.sliders[index];
    }

    // 得到当前的轮播图的索引
    function getActiveSlideIndex() {
        var j = 0;
        //获取当前展示的图片索引
        for (j = 0; j < this.lis.length; j++) {
            if (DOM(this.lis[j]).hasClass("active")) {
                flag = j;
                break;
            }
        }
        return j;
    }

    // 得到当前的轮播图的长度
    function getSlideLength() {
        return this.sliders.length;
    }


    /****************************
  // 拓展共有方法
  /***************************/
    Slider.prototype.setActiveSlide = setActiveSlide;
    Slider.prototype.sliderDidSlide = sliderDidSlide;
    Slider.prototype.getSlideByIndex = getSlideByIndex;
    Slider.prototype.getActiveSlideIndex = getActiveSlideIndex;
    Slider.prototype.getSlideLength = getSlideLength;
    Slider.prototype.sliderWillSlide = sliderWillSlide;
    Slider.prototype.on = on;
    Slider.prototype.trigger = trigger;
    /****************************
   // 初始化，添加响应函数
   /***************************/
    function init(that) {
        //是否暂停
        var pause=false;
        var items = that.items;
        var lis = that.lis;
        //自动轮播
        if (that.autoSlide && items.length > 1)
        {
            var i = 0;
            that.timer = setInterval(function () {
                if (!pause) {
                    that.setActiveSlide(i);
                    i++;
                    if (i == items.length) {
                        i = 0;
                    }
                }
            }, that.slideInterval);
        }
        //鼠标移上去，出现方向选择按钮
        DOM(that.context).addHandler("mouseover", function () {          
            that.prev[0].style.display = "inline-block";
            that.next[0].style.display = "inline-block";
            pause = true;
        });
        //鼠标移下来，方向选择按钮消失
        DOM(that.context).addHandler("mouseout", function () {
            that.prev[0].style.display = "none";
            that.next[0].style.display = "none";
            pause = false;
        });
        //给图上的圆点添加事件
        DOM(lis).addHandler("click", function () {
            //设置当前点击是圆点的点击
            slider.clickName = "liClick";
            for (var j = 0; j < lis.length; j++) {
                if (this == lis[j]) {
                    that.active = j;
                }
            }
            that.setActiveSlide(that.active);
        });
        //前进按钮
        DOM(that.prev).addHandler("click", function () {
            var k = 0;
            var flag = 0  //记录当前的图片序号
            //设置当前点击是圆点的点击
            slider.clickName = "prevClick";
            //获取当前展示的图片
            for (k = 0; k < items.length; k++) {
                if (DOM(lis[k]).hasClass("active")) {
                    flag = k;
                }
            }
            //设置目的图象显示
            if (flag == 0) {
                that.setActiveSlide(items.length - 1);
            }
            else {
                that.setActiveSlide(--flag);
            }
        });
        //后退按钮
        DOM(that.next).addHandler("click", function () {
            var k = 0;
            var flag = 0  //记录当前的图片序号
            //设置当前点击是圆点的点击
            slider.clickName = "nextClick";
            //获取当前展示的图片
            for (k = 0; k < lis.length; k++) {
                if (DOM(lis[k]).hasClass("active")) {
                    flag = k;
                }
            }
            //设置目的图片显示
            if (flag == items.length - 1) {
                that.setActiveSlide(0);
            }
            else {
                that.setActiveSlide(++flag);
            }
        });      
    }
}();
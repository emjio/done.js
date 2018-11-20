/*
 * downchange v1.0
 * @author chenmonster
 * @github  
 */
(function(el, props) {
    "use strict";
    /***
     * 轮播插件Down v1.0
     * @param {Object} el 内容容器(必填)
     * @param {Object}  文字内容(可选)
     * @param {Object} duration 显示时长(可选) 默认2000
     * @param {Object} items_length // 轮播的元素长度 自动获取
     * @param {Object} duration 分页器(可选) //
     * @param {Object} autoplay 是否自动播放(可选)	
     * @param {Object} 播放 显示时长(可选)			
     * 使用方法 参考demo.html
     */
    var addEvents = (function() {
        //能力检测
       // console.log(1)
        if (window.addEventListener) {
            return function(target, type, handler) {
                target.addEventListener(type, handler, false);
            };
        } else if (window.attachEvent) {
            return function(target, type, handler) {
                target.attachEvent("on" + type, handler);
            };
        }
    })();
    var getStyle = function(obj, attr) {
        if (obj && obj.currentStyle) {
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, null)[attr];
        }
    };

    var defaultprops = {
        // 默认参数 
        duration: 2000,
        autoplay: true,
        barclickable: false,
        spacebetwen: 0

    };

    function Done(el, props) {
        props = props || defaultprops;
        this.name = props.name || '匿名';
        this.el = document.querySelector(el);
        this.bar = this.el.querySelector('.Done_bar') || '';
        this.item = this.el.querySelectorAll('.Done_item');
        this.item_width = this.el.offsetWidth;
        this.item_cover = this.el.querySelector('.Done_cover');
        for (var k in defaultprops) {
            if (!props[k]) {
                props[k] = defaultprops[k];
            }
        }
        for (var k in props) {
            this[k] = props[k];
        }
        //混入继承  判断传入的opts是否有默认参数中的值，如果默认参数值不存在opts中
        //         就把默认参数加进opts中,这样就不会把默认参数修改了
        this.timer = null;
        this.latestTime = 0,
            this.init();
    }

    Done.prototype = {
        Vison: 'v1.0',
        constructor:Done,
        init: function() {
            this.creatnode();
            this.addEvent();
            this.timer = setInterval(this._autoPlay(), this.duration);
        },
        creatnode: function() { //初始化相关属性并创建节点
            var self = this;
            var bullets = document.createElement('span');
            bullets.setAttribute("class", "Down_bullets");
            this.item_cover.style.transform = 'translate3d(0px, 0px, 0px)';
            for (let i = 0; i < this.item.length; i++) {
                var bullets = document.createElement('span');
                 bullets.setAttribute("class", "Down_bullets");
                this.item[i].style.width = `${this.item_width}px`;
                this.bar.appendChild(bullets);
                this.bar.querySelectorAll('span')[i].setAttribute('tabindex',i);
                self.bar.querySelectorAll('span')[i].setAttribute('rol-babel',`go to ${i}`);
                this.item[i].style.marginRight = `${this.spacebetwen}px`
            }
            this.bar.querySelectorAll('span')[0].classList.add('current');
            console.log(`感谢使用本插件,如果觉得满意请给我的github 点一个star 谢谢 当前版本${this.__proto__.Vison} github地址https://github.com/emjio/jike` )

        },
        addEvent: function() {
            var self = this;
            addEvents(window, "resize", function() {
                var nowwidth = self.el.offsetWidth;
                self.item_width = nowwidth;
                for (let i = 0; i < self.item.length; i++) {
                    self.item[i].style.width = `${nowwidth}px`;
                    // self._autoPlay();
                }
            })
            if(this.barclickable){
                self.bar.classList.add('Down_bullets_clickable');
                for (let i = 0; i < self.bar.querySelectorAll('span').length ; i++) {
                    addEvents(self.bar.querySelectorAll('span')[i],"click",function(e,i


                        ){
                     console.log(this);
                     console.log(i)
                    })
                }
                
            }

        },
        _autoPlay: function() {
                var self = this;
                var currentposition = 0; //初始值为0
                self.item[0].classList.add('nowitem');
                self.bar.querySelectorAll('span')[0].classList.add('current');
                return function() {
                    if (self.latestTime == self.item.length - 1) {
                        self.latestTime = 0;
                        currentposition = 0;
                    } else {
                        self.latestTime++;
                        currentposition = parseInt(currentposition - self.item_width - self.spacebetwen);
                    }
                    for(let i = 0; i< self.item.length;i++){
                        self.bar.querySelectorAll('span')[i].classList.remove('current');
                         self.item[i].classList.remove('nextitem');   
                         self.item[i].classList.remove('nowitem');
                         self.item[i].classList.remove('previtem');
                    }
                    switch (self.latestTime) {
                        case 0:
                            self.item[self.latestTime+1].classList.add('nextitem');
                            break;
                        case self.item.length-1:
                            self.item[self.latestTime-1].classList.add('previtem');
                            break;  
                        default:
                            self.item[self.latestTime+1].classList.add('nextitem');   
                            self.item[self.latestTime].classList.add('nowitem');
                            self.item[self.latestTime-1].classList.add('previtem');;
                            break;
                    }
                    self.bar.querySelectorAll('span')[self.latestTime].classList.add('current')
                     self.item_cover.style.transform = `translate3d(${currentposition}px, 0px, 0px)`;
                   
                }

            }
        }
         window.Done = Done;
        })(window);

        function createdone(el, props) {
            //封装new操作 处理传入参数
            if (!!el) {
                return new Done(el, props)

            } else {

                throw ('el cant be null') // 节点不能为空	
            }

        }
/*
 * downchange v1.0
 * @author chenmonster
 * @github  
 */
(function(el, props) {
    // "use strict";
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
        duration: 2000,     //轮播时间
        autoplay: false,    // 是否自动播放
        barclickable: false, //按钮是否可以点击
        spacebetwen: 0,     // 每一个图片的间距
        initposition:0,      // 初始位置 选择从第几个开始轮播
        loop:false,         //是否循环滚动
    };

    function Done(el, props) {
        props = props || defaultprops;
        for (var k in defaultprops) {
            if (!props[k]) {
                props[k] = defaultprops[k];
            }
        }

        for (var k in props) {
            this[k] = props[k];
        }

        /**
        *混入继承  判断传入的opts是否有默认参数中的值，如果默认参数值不存在opts中
        *就把默认参数加进opts中,这样就不会把默认参数修改了
        */

        this.name = props.name || '匿名';
        this.el = document.querySelector(el);
        this.bar = this.el.querySelector('.Done_bar') || 'null';
        this.item = this.el.querySelectorAll('.Done_item');
        this.item_width = this.el.offsetWidth;
        this.item_cover = this.el.querySelector('.Done_cover');
        this.timer = null;
        this.lastime = this.initposition;
        this.nextbtn = this.el.querySelector('.swiper-button-next');
        this.prevbtn = this.el.querySelector('.swiper-button-prev');
        this.init();
    }
    Done.prototype = {
        Vison: 'v1.0',
        constructor:Done,
        el:{
            container:'.a',
        },
        init: function() {
            this.creatnode();
            this.addEvent();
            this._autoPlay();
        },

        creatnode: function() { 
            /*
            *
            *初始化相关属性并创建节点
            *设置初始位置生成按钮和箭头
            *
            *
            */

            var self = this;
            this.item_cover.style.transform = `translate3d(-${this.initposition*(this.item_width + this.spacebetwen)}px, 0px, 0px)`;
            var bullets = document.createElement('span'); 
            bullets.setAttribute("class", "Down_bullets");
            this.item.forEach((val,i)=>{
            let bullets = document.createElement('span');
            bullets.setAttribute("class", "Down_bullets");
            this.item[i].style.width = `${this.item_width}px`;
            this.bar.appendChild(bullets);
            this.bar.querySelectorAll('span')[i].setAttribute('tabindex',i);
            this.bar.querySelectorAll('span')[i].setAttribute('rol-babel',`go to ${i}`);
            this.item[i].style.marginRight = `${this.spacebetwen}px`;
            
            })
            if(this.loop){
                
            }
            this.bar.querySelectorAll('span')[this.initposition].classList.add('current');
            this.item[this.initposition].classList.add('nowitem');
            console.log(`感谢使用本插件,如果觉得满意请给我的github 点一个star 谢谢 你的点赞是我开源的动力，当前版本${this.__proto__.Vison} github地址https://github.com/emjio/jike` )
        },
        addEvent: function() {
             /*
            *
            *绑定事件
            *设置全局监听事件保证轮播位置正确
            *给左右按钮和分页器添加事件
            *鼠标移入暂停轮播移出继续
            */
            var self = this;
            addEvents(window, "resize", function() {
                var nowwidth = self.el.offsetWidth;
                self.item_width = nowwidth;
                for (let i = 0; i < self.item.length; i++) {
                    self.item[i].style.width = `${nowwidth}px`;
                     self._Play();
                }
            })
            if(this.barclickable){
                self.bar.classList.add('Down_bullets_clickable');
                for (let i = 0; i < self.bar.querySelectorAll('span').length ; i++) {
                    addEvents(self.bar.querySelectorAll('span')[i],"click",function(){
                        self._Play(i);
                    })
                }
            }

            for (let i=0;i<self.item.length - 1; i++) {
                addEvents(self.item[i],'mouseover',function(){
                self._Pause();
            })
                addEvents(self.item[i],'mouseout',function(){
                self._autoPlay();
            })
            }
            addEvents(this.prevbtn,'click',function(){
                console.log(1)
            })
            addEvents(this.nextbtn,'click',function(){
                console.log(1)
            })

        },
        /*
        *
        */
        _autoPlay: function() {
                var self = this;
                if(self.autoplay){
                    console.log(1)
                this.timer = setInterval(()=>{
                    return self._Play()},this.duration);
                }
            },
         _Play:function(a){
                var self = this;
                 //console.log(a)
                 self.lastime = a-1||self.lastime;   
                    var currentposition = self.lastime*-(self.item_width + self.spacebetwen) //
                    if(self.loop){
                        if (self.lastime == self.item.length - 1) {
                                self.lastime = 0;
                                currentposition = 0;
                        } else  {
                            self.lastime++;
                            currentposition = parseInt(currentposition - self.item_width - self.spacebetwen);
                        }
                             }else {
                                
                                if (self.lastime == self.item.length - 1) {
                                self.lastime = 0;
                                currentposition = 0;
                                }else if(self.lastime==0){
                                    
                                } 
                                else {
                                    self.lastime++;
                                    currentposition = parseInt(currentposition - self.item_width - self.spacebetwen);
                                }
                              }

                    for(let i = 0; i< self.item.length;i++){
                        self.bar.querySelectorAll('span')[i].classList.remove('current');
                         self.item[i].classList.remove('nextitem');   
                         self.item[i].classList.remove('nowitem');
                         self.item[i].classList.remove('previtem');
                    }

                    switch (self.lastime) {
                        case 0:
                            self.item[self.lastime+1].classList.add('nextitem');
                            break;
                        case self.item.length-1:
                            self.item[self.lastime-1].classList.add('previtem');
                            break;  
                        default:
                            self.item[self.lastime+1].classList.add('nextitem');   
                            self.item[self.lastime].classList.add('nowitem');
                            self.item[self.lastime-1].classList.add('previtem');;
                            break;
                    }
                    self.bar.querySelectorAll('span')[self.lastime].classList.add('current')
                    self.item_cover.style.transform = `translate3d(${currentposition}px, 0px, 0px)`;
              },      
            _Pause:function(){
                clearInterval(this.timer);
            },
            _updata:function(){

            },
        }
         window.Done = Done;
        })(window);

        function createdone(el, props) {
            //封装new操作 处理传入参数
            if (!!el) {
                return new Done(el, props)
            }
            else {
                 throw ('el is not a selector');
                 return
            }

        }
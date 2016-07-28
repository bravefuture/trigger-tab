/**
 * [tab切换]
 * @update: 2016.07.28
 * @author: yongcheng0660@163.com
 * @github: https://github.com/bravefuture
 * html结构：
<ul class="tab clearfix" id="tab1" data-trigger="tab" data-options="{'events':'click','auto':true,'time':2000}">
	<li data-nav="tab" data-target="#cont1">1</li>
	<li data-nav="tab" data-target="#cont2" class="on">2</li>
	<li data-nav="tab" data-target="#cont3">3</li>
</ul>
<div>
	<div class="tab-cont" data-cont="tab" id="cont1" style="display:none;">1</div>
	<div class="tab-cont" data-cont="tab" id="cont2">2</div>
	<div class="tab-cont" data-cont="tab" id="cont3" style="display:none;">3</div>
</div>
 * 	
 * 方法
// 指定到某个tab时触发
$('#tab1').on('index.enjoy.tab', function(e, i){
	if(i == 1){
		console.log && console.log(i);
	}
});
 */
(function($, undefined){
	/**
	 * [dataTrigger data属性API]
	 * @type {String}
	 */
	var dataTrigger = '[data-trigger="tab"]';
	var dataNav = '[data-nav="tab"]';
	var dataCont = '[data-cont="tab"]';
	/**
	 * [tab 标签构造函数]
	 */
	var Tab = function(element, options){
		/**
		 * [获取该元素对象]
		 */
		this.tabDom = element;
		/**
		 * [获取参数值]
		 */
		this.events = options.events;
		this.selectName = options.selectName;
		this.auto = options.auto;
		this.time = options.time;
		this.slideBar = options.slideBar;
		this.slideSpeed = options.slideSpeed;

		this.tabNav = this.tabDom.children(dataNav);
		this.on = this.tabDom.children('.' + this.selectName + dataNav);
		/**
		 * [tabNavLen 标签长度]
		 * @type {[type]}
		 */
		this.tabNavLen = this.tabNav.length;
		
		this.defaultTab();
		/**
		 * [if 是否为自动轮播]
		 * @param  {[type]} this.auto [description]
		 * @return {[type]}           [description]
		 */
		if(this.auto === true){
			this.tabAuto();
			this.tabHover();
		}
		/**
		 * [if 是否含有滑动块]
		 * @param  {[type]} this.slideBar [description]
		 * @return {[type]}               [description]
		 */
		if(this.slideBar !== false){
			this.slide();
		}
	};
	/**
	 * [version 定义版本号]
	 * @type {String}
	 */
	Tab.prototype.version = '2.0.0';
	/**
	 * [defaultTab 绑定事件]
	 * @param  {[type]} events [默认事件为click]
	 * @return {[type]}        [description]
	 */
	Tab.prototype.defaultTab = function(){
		var that = this;
		this.tabDom.on(this.events + '.enjoy.tab', dataNav, function(e){
			var _this = $(this);
			_this.addClass(that.selectName).siblings(dataNav).removeClass(that.selectName);
			var target = $(_this.attr('data-target'));
			target.show().siblings(dataCont).hide();				
			that.getIndex(_this.index());
			e.stopPropagation();
		});
		this.tabOn();
	};
	/**
	 * [tabIndex 选中某tab]
	 * @param  {[type]} index [索引]
	 * @return {[type]}       [description]
	 */
	Tab.prototype.tabIndex = function(index){
		var nav = this.tabNav.eq(index);
		nav.addClass(this.selectName).siblings(dataNav).removeClass(this.selectName);
		var target = $(nav.attr('data-target'));
		target.show().siblings(dataCont).hide();
		this.getIndex(index);
	};
	/**
	 * [tabOn 以selectName选中某tab]
	 * @return {[type]} [description]
	 */
	Tab.prototype.tabOn = function(){
		if(this.on.index() === -1){
			this.tabIndex(0);
		}
		else{
			this.on.trigger(this.events + '.enjoy.tab');
		}			
	};
	/**
	 * [getIndex 监听标签索引]
	 * @param  {[type]} index [description]
	 * @return {[type]}       [description]
	 */
	Tab.prototype.getIndex = function(index){
		this.tabDom.trigger('index.enjoy.tab', [index]);
	};
	/**
	 * [tabAuto 自动轮播tab]
	 * @return {[type]} [description]
	 */
	Tab.prototype.tabAuto = function(){
		var that = this;
		var tabNavLen = this.tabNavLen;
		var onIndex = this.tabDom.children('.' + this.selectName + dataNav).index();
		this.timer = setTimeout(function(){
			if(onIndex === tabNavLen - 1){
				onIndex = -1;
			}
			that.tabIndex(++onIndex);
			clearTimeout(that.timer);
			that.timer = setTimeout(arguments.callee, that.time);
		}, this.time);
	};
	/**
	 * [tabHover 停止轮播或启动轮播]
	 * @return {[type]} [description]
	 */
	Tab.prototype.tabHover = function(){
		var that = this;
		var dataContParent = $(this.on.attr('data-target')).parent();
		var dataContDom = dataContParent.children(dataCont);
		var tabNavDom = this.tabDom.children(dataNav);
		dataContDom.add(tabNavDom).hover(
			function(){
				clearTimeout(that.timer);
			},
			function(){
				that.tabAuto();
			}
		);
	};
	/**
	 * [savePos 存贮tab位置]
	 * @return {[type]} [description]
	 */
	Tab.prototype.saveLeft = function(){
		var leftArr = [];
		for(var i = 0; i < this.tabChildLen; i++){
			leftArr.push(this.tabChild.eq(i).offset().left - this.tabDom.offset().left);
		}
		return leftArr;
	};
	/**
	 * [savePos 存贮tab宽度]
	 * @return {[type]} [description]
	 */
	Tab.prototype.saveWidth = function(){
		var widthArr = [];
		for(var i = 0; i < this.tabChildLen; i++){
			widthArr.push(this.tabChild.outerWidth());
		}
		return widthArr;
	};
	/**
	 * [saveOnLeft 存贮tab左移位置]
	 * @return {[type]} [description]
	 */
	Tab.prototype.saveOnLeft = function(){
		this.slideBar = $(this.slideBar);
		this.tabChild = this.tabDom.children();
		this.tabChildLen = this.tabChild.length;
		var slideBarW = this.slideBar.width();
		var onLeftArr = [];
		var saveLeft = this.saveLeft();
		var saveWidth = this.saveWidth();
		for(var i = 0; i < this.tabChildLen; i++){
			onLeftArr.push(saveLeft[i] - (slideBarW - saveWidth[i]) / 2);
		}
		return onLeftArr;
	};
	/**
	 * [slide 绑定滑动]
	 * @return {[type]} [description]
	 */
	Tab.prototype.slide = function(){
		var that = this;
		var onLeft = this.saveOnLeft();
		this.tabDom.on('mouseenter.enjoy.tab', dataNav, function(e){
			var _this = $(this);
			that.slideBar.stop(true).animate({left: onLeft[_this.index()]}, that.slideSpeed);
		});
		this.tabDom.on('mouseout.enjoy.tab', dataNav, function(e){
			var _this = $(this);
			var onIndex = that.tabDom.children('.' + that.selectName + dataNav).index();
			that.slideBar.stop(true).animate({left: onLeft[onIndex]}, that.slideSpeed);
		});
	};
	/**
	 * [init 实例化]
	 * @this  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	var init = function(options){
		return this.each(function(){
			var _this = $(this);
			var data = _this.data('enjoy.tab');
			if(!data){
				_this.data('enjoy.tab', (data = new Tab(_this, options)))
			}
		});
	};
	/**
	 * [参数设置]
	 * @return {[type]} [description]
	 */
	$(dataTrigger).each(function(){
		var _this = $(this);
		var dataOptions = _this.attr('data-options') || '';
		var pJData = dataOptions === '' ? {} : $.parseJSON(dataOptions.replace(/\'/g, '\"'));
		var options = $.extend({
			events: 'click',
			selectName: 'on',
			effect: '',
			auto: false,
			time: 5000,
			slideBar: false,
			slideSpeed: 200
		}, pJData || {});
		init.call(_this, options);
	});
	
})(jQuery, undefined);
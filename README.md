# trigger-tab
## tab切换
html结构：
```html
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
```

方法：
```javascript
// 指定到某个tab时触发
$('#tab1').on('index.enjoy.tab', function(e, i){
	if(i == 1){
		console.log && console.log(i);
	}
});
```
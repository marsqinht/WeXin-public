
;(function(){

	var $listWrap = $('.adv-road-container');
	var index = 0;
	//更新报价
	$listWrap.on('tap','.adv-road_price',function(){
		var id = $(this).attr('data-id');
		var $upPrice = $(this).closest('.adv-road-items').find('.adv-current_price');
		$.prompt("请输入输入最新报价(单位:元/吨)", function(text) {
		  //点击确认后的回调函数
		  var price = $('#weui-prompt-input').val();
		  if (!/^\d+(\.\d+)?$/.test(price)) {
		  	$.toast("请输入数字", "forbidden");
		  	return;
		  }
		  updatePrice(id,price,$upPrice);
		  });
	});
	//无限加载
	var loading = false;  //状态标记
	$(document.body).infinite().on("infinite", function() {
	  if(loading) return;
	  $('.weui-infinite-scroll').show();
	  loading = true;
	  index += 10;
	  getAdvList(index,10);
	});
	/**
	 * 获取常跑路线列表
	 * @param  {[type]} index [页数索引]
	 * @param  {[type]} size  [返回数据数目]
	 */
	function getAdvList(index,size){
		$.get('/api/InfoDepartApi/AdvantageLine?pageIndex='+index+'&pageSize='+size,function(data){
			console.log(data)
			if (data && data.IsSuccess) {
				var html = template('tpl_adv-list',data);
				$('.adv-road-container').append(html);
				$('.weui-infinite-scroll').hide();
				if (data.Data.length == 0) {
					$('.weui-infinite-scroll').remove();
					$('body').append('<div class="loading-tips">已全部加载完毕!</div>');
					$(document.body).destroyInfinite();
				};
				if ($('.adv-road-items').length==0) {
					$('.loading-tips').remove();
					$('.adv-no-data').show();
				};
			}

		});
	}
	/**
	 * 更新路线价格
	 * @param  {[int]} id    [线路Id]
	 * @param  {[decimal]} price [更新价格]
	 */
	function updatePrice(id,price,obj){
		$.get('/api/InfoDepartApi/UpdateLinePrice?id='+id+'&price='+price,function(data){
			if (data && data.IsSuccess) {
				obj.text(price);
				$.toast(data.Message);
			};
		})
	}
	getAdvList(index,10);
})();
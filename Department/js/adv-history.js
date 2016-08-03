;
(function() {
	var $list = $('.his-price-cells');
	var oId = location.search.split('=')[1];
	//获取历史报价列表
	getHistoryList(oId)
	function getHistoryList(id) {
		$.get('/api/InfoDepartApi/GetLineHistoryPrice?lineId=' + id + '&pageIndex=0&pageSize=10', function(data) {
			console.log(data)
			if (data && data.IsSuccess) {
				var html = template('tpl_history', data);
				$('#his-common-a').html(data.Data[0].PointAProvinceRegionName + data.Data[0].PointACityRegionName + data.Data[0].PointASubRegionName + ' ' + data.Data[0].StartPointName);
				$('#his-common-b').html(data.Data[0].PointBProvinceRegionName + data.Data[0].PointBCityRegionName + data.Data[0].PointBSubRegionName + ' ' + data.Data[0].EndPointName);
				$list.html(html);
			};
		})
	};
	//线路停运
	function cancelLine() {
		console.log(11)
		$.confirm("如果停运该路线,下次该路线下的发货消息将无法接收", '是否确定停运?', function() {
			//点击确认后的回调函数
			$.get('/api/InfoDepartApi/DisableLine?lineId=' + oId, function(data) {
				console.log(data)
				if (data && data.IsSuccess) {
					$.toast('停运成功!', function() {
						window.location.href = 'AdvantageIndex';
					});
				};
			})
		}, function() {
			//点击取消后的回调函数
		});
	}
	$('.his-top-btn').on('tap', cancelLine);
})();
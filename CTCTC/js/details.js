;(function(){
	var oSearch = location.search;
	var $aContent = $('.order-detail_conent');
	var startName = '';
	var endName = '';

	function getDetails(id){
		$.get('/api/CTCTC/TrackApi/GetTicketDetailById'+id,function(data){
			console.log(data);
			if (data && data.IsSuccess) {
					var oData = data.SingleData;
					$aContent.eq(0).text(oData.TicketCode);
					$aContent.eq(1).text(oData.VehicleNo);
					$aContent.eq(2).text(oData.BPText+oData.BCText+oData.BSText);
					$aContent.eq(3).text(oData.EPText+oData.ECText+oData.ESText);
					$aContent.eq(4).text(oData.TicketWeightInit+'吨');
					if (oData.CreateTime) {
						$aContent.eq(5).text(oData.CreateTime.split('T').join(' '));
						$aContent.eq(8).text(oData.CreateTime.split('T').join(' '));
					};
					$aContent.eq(6).text(oData.TicketWeightReach);
					if (oData.TicketWeightReachTime) {
						$aContent.eq(7).text(oData.TicketWeightReachTime.split('T').join(' '));
						$aContent.eq(11).text(oData.TicketWeightReachTime.split('T').join(' '));
					};
					if (oData.TicketMemo) {
						$('.order-detail_memo').text(oData.TicketMemo);
					};

					$aContent.eq(9).text(oData.TicketCode);
					$aContent.eq(10).text(oData.TicketWeightInit+'吨')
					$aContent.eq(12).text(oData.TicketCode);
					$aContent.eq(13).text(oData.TicketWeightInit+'吨');
					$('.receipt-pic').eq(0).find('img').attr('src',oData.InitPath);
					$('.receipt-pic').eq(1).find('img').attr('src',oData.ReachPath);
					// 百度地图API功能
					var map = new BMap.Map("allmap");
					/*var start = oData.BSText;
					var end = oData.ESText;
					console.log(start,end)
					//map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
					//三种驾车策略：最少时间，最短距离，避开高速
					var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
					map.clearOverlays();
					map.enableScrollWheelZoom(true);
					var i=$("#driving_way select").val();
					search(start,end,routePolicy[0]);

					function search(start,end,route){
						var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
						driving.search(start,end);
					}
*/
					var output = "";
					var searchComplete = function (results){
						if (transit.getStatus() != BMAP_STATUS_SUCCESS){
							return ;
						}
						var plan = results.getPlan(0);
						output = "总路程约："+plan.getDistance(true) + "\n";
						         //获取距离
					}
					var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map},
						onSearchComplete: searchComplete,
						onPolylinesSet: function(){
							$('.map-total-mile').html(output);
					}});
					transit.search(oData.BSText, oData.ESText);
			};
		})
	}
	getDetails(oSearch)
})();
;(function(){
	$.get('/api/InfoDepartApi/GetAccount',function(data){
		console.log(data);
		if (data && data.IsSuccess) {
			var money = data.SingleData.AccountBalance;
			$('.wallet-num').html(money);
		};
	})

	$.get('/api/InfoDepartApi/GetInfoDepartInfo',function(data){
		console.log(data);
		if (data && data.IsSuccess) {
			var oData = data.SingleData;
			$('.wallet-info').html(oData.TenantName);
			$('.wallet-cell').html(oData.TenantAgentStaffTel);
		};
	})

})();
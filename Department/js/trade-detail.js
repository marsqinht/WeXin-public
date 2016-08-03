;(function(){
	var $packPopUp = $('#pack-price'),//更新价格弹框
			$updataBtn = $packPopUp.find('.pack-update-btn'),//确定更新
			$oForm = $('#pack-update-form'),
			packageId = location.search,
			apply = '',
			maxCar = 0;
			//更新报价
			function uadatePrice(){
					var oF = $oForm.serialize();
					var $aIn = $oForm.find('input');
					var upPrice = $aIn.eq(0).val();
					var upCar = $aIn.eq(1).val();
					if (!/^[0-9]+\.?[0-9]{0,4}$/.test(upPrice)) {
					  $.toast('请输入正确报价!','forbidden');
					  return;
					};
					if (parseFloat(upCar)>parseFloat(maxCar)) {
                      $.toast('报价车数超过上限!','forbidden');
					  return;
					};
					if (!/^\+?[1-9]\d*$/.test(upCar)) {
					  $.toast('车数必须为正整数!','forbidden');
					  return;
					};
					console.log(oF);
					$.showLoading('正在报价中');
				$.get('/api/InfoDepartApi/ApplyPackage'+packageId+'&'+oF,function(data){
					console.log(data);
					if (data && data.IsSuccess) {
						$.hideLoading();
						$.toast('报价成功',function(){
							sessionStorage.num = 2;
							location.href='TradeIndex';
						});
					}else{
						var oData = JSON.parse(data);
						$.hideLoading();
						$.toast(oData.Message || '修改失败','forbidden');
					}
				})
				closePop();
				cearVal();
			}
			function cearVal(){
				$oForm.find('input').val('');
			}
			$updataBtn.on('tap',uadatePrice);


	var packageId = location.search;//运单packId
	var companyName = '';
	var contact = 0;
	var oPrice = '';
	//撤销报价
	$(document).on('tap','.apply-price-c',function(){
       $.confirm("确定申请撤销吗?","申请撤销", function() {
       		  //点击确认后的回调函数
       		  cancelPack();
       		  });

	})

	$(document).on('tap','.c-pack_btn',function(){
		$.confirm("确定申请取消吗?","申请取消", function() {
		  //点击确认后的回调函数
		  cancelPack();
		  });
	})
	//呼叫车主
	$(document).on('tap','.pack-contact',function(){
		$.modal({
		  title: "单位名称："+companyName+"<br>联系电话："+contact+"",
		  text: "主动联系货主确认价格和承运车次，让货主尽快与您达成中标，并开始承运",
		  buttons: [
		    { text: "取消", className: "cancel",onClick: function(){
		    	$.closeModal();
		    } },
		    { text: "呼叫", className: "confirm", onClick: function(){ console.log(3)} }
		  ],
		  autoClose: true
		});
		$('.confirm').attr('href','tel:'+contact+'')
	});

	//获取包详情
	function getPackDetail(){
		$.get('/api/InfoDepartApi/GetVPackge'+packageId,function(data){
			console.log(data)
			if (data && data.IsSuccess) {
				var single = data.SingleData;
				maxCar = single.PackageCount;
				var html = template('tpl-detail',data);
				//var invoice =single.NeedInvoice?'是':'否';
				var isOn =single.PackageSettlementType?'线下结算':'线上结算';
				$('.tpl-wrap').html(html);
				companyName = single.TenantName;
				contact = single.TenantTel;
				//$('.need-invoice').text(invoice);
				$('.item-type').text(isOn);
				if (oPrice) {
					$('.pack-already_price').text(oPrice+'元/吨');
					$('.detail-imortant').show();
				};
			};
		})
	}
	//取消订单
	function cancelPack(){
		$.showLoading('正在申请中');
		$.get('/api/InfoDepartApi/CancleApplyPackage?applyPakcageId='+apply,function(data){
			console.log(data);
			if (data && data.IsSuccess) {
				$.hideLoading();
				$.toast('申请取消成功,请耐心等待客服联系!',function(){
					location.href = 'TradeIndex';
				});
			}else{
				var oData = JSON.parse(data);
				$.hideLoading();
				$.alert(oData.Message || '撤销失败');
			}
		})
	}
	//获取报价单 显示状态
	function getStatus(){
		$.get('/api/InfoDepartApi/GetInfoDepartPP'+packageId,function(data){
			console.log(data);
			if (data.IsSuccess && data.SingleData) {
				var oData = data.SingleData;
				$('#pack-update-form').find('input').eq(0).val(oData.Price);
				$('#pack-update-form').find('input').eq(1).val(oData.VehiclesCount);
				console.log(11);
				apply = oData.Id;
				if (oData.CustomOperation==0 || oData.CustomOperation==2) {
				if (oData.Status==0) {//已生效;
					oPrice = oData.Price;
					if (oData.Bidding==4 || oData.Bidding == 5) {
						$('.pack-do-order').show();
						if (oData.Bidding==4) {
							$('.do-order-go').attr('href','javascript:;').addClass('btn-to-gray');
						}else{
							$('.do-order-go').attr('href','Dispatch?OrderId='+oData.Id);
						}
					}else{
						if (oData.Bidding==8 || oData.Bidding==6){
							$('.pack-contact-btn').hide();
						}else{
							$('.pack-contact-btn').show();
						}
					}

				};
				};
				if (oData.CustomOperation==1) {
                   $('.lock-btn').show();
			    }
			}else{
				$('.package-btn').show();
			}

		})
	}

	getStatus();
	getPackDetail();
})();
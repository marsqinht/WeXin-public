;(function(){
	var $list = $('.dis-car-list');
	var $listSelected = $('.list-selected');
    var pJson = toJson(location.search.substring(1))
	var orderId = pJson.OrderId;
	var orderStatus = ['待生效','待执行','待换票','待装运','待收货','待核准','待结算','可领取','已结算','禁用','取消','已删除'];
    var turnOff = true;
	$('#id-input').val(orderId);

    if (pJson.aa) {
    $('.dis-btn').remove();
    };
	//指派车辆
	//获取运单信息
	  function getTicket(){
	    $.get('/api/InfoDepartApi/GetVDepartInfoTicketList?id='+orderId+'&pageIndex=0&pageSize=10',function(data){
	      console.log(data);
	      if (data && data.IsSuccess) {
	      	var html = template('tpl-list',data);
	      	$('.dis-items-wrap').html(html);
          var Len = data.Data.length;
	      	for (var i = 0; i < Len; i++) {
	      		var n = parseInt(data.Data[i].TicketStatus);
	      		$('.dis-status').eq(i).text('运单状态：'+orderStatus[n]);
	      	};
          if (Len==0) {
            $('.adv-no-data').show();
          };
          if (Len >=5) {
            $('.dis-search').show();
          };
          if (pJson.aa) {
            $('.up-content').html('查看');
          };
	      };
	    });
	  }

     getTicket();

  //参数json化
  function toJson(str){
    var arr = str.split('&');
    var oP = {};
    for (var i = 0; i < arr.length; i++) {
       var key = arr[i].split('=')[0];
       var value = arr[i].split('=')[1];
       oP[key] = value;
    };
    return oP;
  }
	$('.dis-car_btn').on('tap',function(){
    if (!turnOff) return;
		var oF = $('#dis-form').serialize();
		if (!isVehicleNumber($('#car-num_input').val())) {
			$.toast('请输入正确的车牌号!',"forbidden");
			return;
		};
    turnOff = false;
		dispatchCar(oF);
	});

	$list.on('tap','li',function(){
		var carNum = $(this).text();
    var phone = $(this).attr('data-phone');
		//$listSelected.find('li').text(carNum);
    $('#car-phone_input').val(phone);
		$('#car-num_input').val(carNum)
	})
	//长按删除
	$list.on('longTap','li',function(){
		var num = $(this).attr('data-num');
		$.confirm("是否确定删除当前车辆", function() {
	  //点击确认后的回调函数
	  	delCar(num);
	  }, function() {
	  //点击取消后的回调函数
	  });
	});

	//执行订单搜索
	$('.s-order-list').on('tap',function(){
		seacrhCar($('.car-num-wrap'),$('#s-order-input').val(),'.dis-items');
	})

	//车辆列表搜索
	$('.s-car-list').on('tap',function(){
		seacrhCar($('.car-list_cell'),$('#s-car-input').val());
	})

	//删除车辆
  function delCar(num){
    $.get('/api/InfoDepartApi/DelVehicle?vehicleId='+num,function(data){
      console.log(data);
      if (data && data.IsSuccess) {
      	$.toast('成功删除车辆');
      }else{
      	$.toast(data.Message || "删除车辆失败","forbidden");
      }
    });
  }

  //获取车辆列表
  function getCar(){
    $.get('/api/InfoDepartApi/GetVehicle?pageIndex=0&pageSize=100',function(data){
      console.log(data);
      if (data && data.IsSuccess) {
      	var str = template('tpl-car',data);
      	$('.dis-car-list').html(str);
      };
    });
  }
  getCar();

  function dispatchCar(p){
  	$.showLoading('正在派车中');
  	$.get('/api/InfoDepartApi/ArrangeVehicle?'+p,function(data){
  		console.log(data);
  		if (data && data.IsSuccess) {
        turnOff = true;
  			$.hideLoading();
  			$.toast('派车成功!',function(){
          getCar();
          getTicket();
          closePop();
          $('.adv-no-data').hide();
        });
  		}else{
        turnOff = true;
  			var oData = JSON.parse(data);
  			$.hideLoading();
  			$.toast(oData.Message || "派车失败","forbidden");
  		}
  	})
  }
  //dispatchCar()
  function seacrhCar(obj,result,pa){
  	obj.each(function(index,elem){
  		var s = new RegExp(result);
  		console.log(s.test($(elem).text()))
  		if (s.test($(elem).text())) {
  			pa?$(elem).parents(pa).show():$(elem).show();
  		}else{
  			pa?$(elem).parents(pa).hide():$(elem).hide();
  		}
  	})
  }

  function isVehicleNumber(vehicleNumber) {
      var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Za-z]{1}[A-Za-z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9a-z]{4}[A-Z0-9a-z挂学警港澳]{1}$/;
      return express.test(vehicleNumber);
  }
})();
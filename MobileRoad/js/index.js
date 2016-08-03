;(function(){
	var oSe = window.location.search.substring(1).split('=')[1];
	var keyW = oSe?oSe:'';
	$(".list-wrap").on('tap','.depart-detail',function(){
		  var id = $(this).attr('data-id');
		  getDepartDetail(id);
	    //$("#popup-wrap").popup();
	});
	if (sessionStorage.keyword) {
		$('#search_text').find('span').html('上次搜索关键字：'+sessionStorage.keyword);
	};
	getList(keyW);

	$('#search_input').on('blur',function(){
		console.log($(this).val())
		sessionStorage.keyword = $('#search_input').val();
		var oV = $(this).val();
		getList(oV);
		return false;
	});
	function getList(key){
			$.get('/api/RoadIndexApi/GetDepartmentList?keyWord='+key,function(data){
		      if (data && data.IsSuccess) {
		        //console.log(data);
		        var departList = data.Data;
		        var html = '';
		        var Len = departList.length<10?departList.length:10;
		        for (var i = 0; i < Len; i++) {
		        	html+='<div class="weui_cell">'+
		              '<div class="weui_cell_bd weui_cell_primary depart-detail" data-id='+departList[i].Id+'>'+
		              '<p><a href="javascript:;" class="open-popup" data-target="#popup-wrap">'+departList[i].TenantName+'</a></p>'+
		              '</div>'+
		              '<a href="/MobileRoad/AddRoad?tenantId='+departList[i].Id+'"><div class="weui_cell_ft">'+departList[i].TenantAgentStaffTel+'</div></a>'+
		             '</div>';
		        };
		        $('#depart-list').html(html);
		      }

		    });
	}
	//监听搜索框变化
	$(window).unload(function(){
			sessionStorage.keyword=$('#search_input').val();
	})

	$('#showTooltips').on('tap',function(){
		var sendForm = $('#sendDepart').serialize();
		var oName = $('#tenant-name').val();
		var oTel = $('#tenant-tel').val();
		if (!oName) {
			$.toast("请输入信息部名称", "forbidden");
			return;
		};

		if (!/^1[34578]\d{9}$/.test(oTel)) {
			$.toast("请输入正确的手机号", "forbidden");
			return;
		};
		console.log(sendForm)
		addDepart(sendForm);
		return false;
	});


	function addDepart(parm){
		$.post('/api/RoadIndexApi/AddDepartment',parm,function(data){
			if (data && data.IsSuccess) {
				$.toast('添加成功');
				getList('');
			}else{
				var oData = JSON.parse(data);
				$.toast(oData.Message || "操作失败", "forbidden");
			}
		});
	};

	function getDepartDetail(id){
		var $popupWrap = $('#popup-wrap').find('.modal-content');
		$.get('/api/RoadIndexApi/GetDepartment?id='+id,function(data){
		  if (data && data.IsSuccess) {
		    var detail = data.SingleData;
		    console.log(detail);
		    if (detail.DepartType==1) {
		    	var dType = '企业';
		    }else{
		    	var dType = '其它';
		    };
		    var aList =[
		    	{
		    		item:'信息部名称',
		    		name:detail.TenantName
		    	},
		    	{
		    		item:'信息部类型',
		    		name:dType
		    	},
		    	{
		    		item:'手机',
		    		name:detail.TenantAgentStaffTel
		    	},
		    	{
		    		item:'微信号',
		    		name:detail.VxNum
		    	},
		    	{
		    		item:'经度',
		    		name:detail.TenantLongitude
		    	},
		    	{
		    		item:'纬度',
		    		name:detail.TenantLatitude
		    	},
		    	{
		    		item:'录入人',
		    		name:detail.InformationDepCreateByName
		    	},
		    	{
		    		item:'备注',
		    		name:detail.TenantMemo
		    	}
		    ];
		    var html = '';
		    $('#popup-wrap').find('.toolbar-add-pic').attr('href','/MobileRoad/AddPic?TenantId='+detail.Id);
		    for (var i = 0; i < aList.length; i++) {
		    	html +='<div class="weui_cells">'+
		                '<div class="weui_cell">'+
		                  '<div class="weui_cell_bd weui_cell_primary">'+
		                      '<p>'+aList[i].item+'</p>'+
		                  '</div>'+
		                  '<div class="weui_cell_ft">'+aList[i].name+'</div>'+
		              '</div>'+
		          		'</div>';
		    };
		    $popupWrap.html(html);
		  }

		});
	}

})();
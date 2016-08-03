;(function(){
	var $startPro = $('#prov-start'),
			$startCity = $('#city-start'),
			$startSub = $('#sub-start'),
			$startPoints =$('#start-points'),
			$endPro = $('#prov-end'),
			$endCity = $('#city-end'),
			$endSub= $('#sub-end'),
			$endPoints = $('#end-points'),
			$startBtn = $('.start-btn_confirm'),
			$endBtn = $('.end-btn_confirm'),
			startParam = '',
			endParam = '';

	//获取地区列表
	function getAreaList(obj,id,shanxi){
		$.get('/api/InfoDepartApi/GetSRegionListByParentId?ParentId='+id,function(data){
			//console.log(data);
			if (data && data.IsSuccess) {
				var html = template('tpl-region',data);
				if (id == 109000000 ) {
				}else{
					html = '<option value="0">不限</option>'+html;
				}
				obj.html(html);
				if (shanxi) {
				  obj.find('option').each(function(i,elem){
				    if ($(elem).val()=='109000238') {
				      $(elem).prop('selected','selected');
				    };
				  })
				};
			};
		})
	};
	//根据城市Id获取公共点;
	function getPoint(regionId,obj){
		console.log(regionId)
		$.post('/api/InfoDepartApi/GetPoint',regionId,function(data){
			console.log(data);
			if (data && data.IsSuccess) {
				var html = template('tpl-points',data);
				obj.html(html);
			};
		})
	}
	//省市区联动
	function regionChange(self,wrap){
		self.find("option").each(function(index,elem){
		  if ($(elem).attr('selected')) {
		  	var val = parseInt($(elem).attr('value'));
		  	getAreaList(wrap,val);
		  };
		})
	}

	//获取煤品信息
	function getCategoryList(){
		$.get('/api/InfoDepartApi/GetSCategoryList',function(data){
			console.log(data);
			if (data && data.IsSuccess) {
				var html = template('tpl-mei',data);
				$('#mei-list').html(html);
			};
		})
	}

	//添加线路
	function addLine(id){
		if (!$('#price_input').val()) {
			$.toast('请输入线路报价!','forbidden');
			return;
		};
		if (!$('#mile_input').val()) {
			$.toast('请输入线路里程!','forbidden');
			return;
		};
		$.post('/api/InfoDepartApi/AddLine',id,function(data){
			$.showLoading('正在添加线路信息');
			console.log(data);
			if (data && data.IsSuccess) {
				$.hideLoading();
				$.toast('添加成功',function(){
					window.location.href='AdvantageIndex';
				});
			}else{
				var oData = JSON.parse(data);
				$.hideLoading();
				$.toast(oData.Message || '添加失败',"forbidden");
			}
		})
	}
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

  //获取被选中option的值
  function getOptionText(obj){
  	var val = '';
  	obj.find('option').each(function(index,el){
  		if ($(el).attr('selected')) {
  			val = $(el).html();
  			if (val=='不限') {
  				val='';
  			};
  		};
  	})
  	return val;
  }

  //确定添加路线
  $('.new-save-btn').on('tap',function(){
  	var info = $('#line-info').serialize();
  	var oParm = startParam+'&'+endParam+'&'+info;
  	console.log(oParm);
  	addLine(oParm);
  })

	//起点省
	$startPro.on('change',function(){
		var oF = $('#start-region-form').serialize();
				regionChange($(this),$startCity);
				getPoint(oF,$startPoints);
	});

	$startCity.on('change',function(){
		var oF = $('#start-region-form').serialize();
				regionChange($(this),$startSub);
				getPoint(oF,$startPoints);
	});

	$startSub.on('change',function(){
		var oF = $('#start-region-form').serialize();
				getPoint(oF,$startPoints);
	});

	$('.start-btn_confirm').on('tap',function(){
		var oF = $('#start-region-form').serialize();
		var oJ = toJson(oF);
		var startVal = getOptionText($startPro)+getOptionText($startCity)+getOptionText($startSub)+' '+getOptionText($startPoints);
		startParam ='PointAProvinceRegionId='+oJ.ProvinceRegionId+'&PointACityRegionId='+
		oJ.CityRegionId+'&PointASubRegionId='+oJ.SubRegionId+'&CommonPointA='+oJ.CommonPointA;
		$('#add-start').html('出发地：'+startVal);
		console.log(startParam,startVal);
		closePop();
	});

	//终点省
	$endPro.on('change',function(){
		var oF = $('#end-region-form').serialize();
				regionChange($(this),$endCity);
				getPoint(oF,$endPoints);
	});

	$endCity.on('change',function(){
		var oF = $('#end-region-form').serialize();
				regionChange($(this),$endSub);
				getPoint(oF,$endPoints);
	});

	$endSub.on('change',function(){
		var oF = $('#end-region-form').serialize();
				getPoint(oF,$endPoints);
	});

	$('.end-btn_confirm').on('tap',function(){
		var oF = $('#end-region-form').serialize();
		var oJ = toJson(oF);
		var endVal = getOptionText($endPro)+getOptionText($endCity)+getOptionText($endSub)+' '+getOptionText($endPoints);
		endParam ='PointBProvinceRegionId='+oJ.ProvinceRegionId+'&PointBCityRegionId='+
		oJ.CityRegionId+'&PointBSubRegionId='+oJ.SubRegionId+'&CommonPointB='+oJ.CommonPointB;
		$('#add-end').html('目的地：'+endVal);
		console.log(endParam);
		closePop();
	})

  //getAreaList($('#prov-end,#prov-start'),109000000);
  getAreaList($('#prov-start,#prov-end'),109000000,1);
	getAreaList($('#city-start,#city-end'),109000238);
  getCategoryList();
})();
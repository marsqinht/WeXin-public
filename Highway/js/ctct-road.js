;(function(){
	var $region = $('.city-select');
	var $province = $('.province');
	var $city = $('.city');
	var $sub = $('.district');
	var $picker = $('.city-picker-dropdown');
	var $searchRegion = $('.search-input_wrap');
	var $searchText = $('.search-text');
	var textPro = '';
	var textCity = '';
	var textSub = '';
	var regionIndex = 0;
	var j = {
		StartProvince:0,
		StarCity:0,
		StartCounty:0,
		EndProvince:0,
		EndCity:0,
		EndCounty:0,
		CategoryId:0
	};
	var savaData = '';
	var $tBody = $('.table-index-body');
	var $kinds = $('#category-list');
	var oS = location.search?location.search.substring(1):0;
	//切换省市区
	$('.city-select-tab').on('click','a',function(){
		var _index = $(this).index();
		$region.hide().eq(_index).show();
		activeCurr($(this));
	})

	//城市/地区active
	$('.city,.district').on('click','a',function(){
		activeCurr($(this));
	});

	//点击省
	$province.on('click','a',function(){
		var oId = $(this).attr('data-id');
		textPro = $(this).html();
		$region.hide();
		$city.show();
		getRegionList($city,oId);
		activeCurr($(this),'parents');
		activeCurr($('.city-select-tab').find('a').eq(1));
		if (regionIndex==0) {
			j.StartProvince = oId;
			j.StarCity = oId;
		};
		if (regionIndex == 1) {
			j.EndProvince = oId;
			j.EndCity = oId;
		};
		$searchText.eq(regionIndex).text(textPro);
	});

	//点击城市
	$city.on('click','a',function(){
		var oId = $(this).attr('data-id');
		textCity = $(this).html();
		$region.hide();
		$sub.show();
		getRegionList($sub,oId);
		activeCurr($('.city-select-tab').find('a').eq(2));
		if (regionIndex==0) {
			j.StarCity = oId;
		};
		if (regionIndex == 1) {
			j.EndCity = oId;
		};
		$searchText.eq(regionIndex).text(textPro+'/'+textCity);
	});

	//点击地区
	$sub.on('click','a',function(){
		var oId = $(this).attr('data-id');
		textSub = $(this).html();
		$picker.hide();
		if (regionIndex==0) {
			j.StartCounty = oId;
		};
		if (regionIndex == 1) {
			j.EndCounty = oId;
		};
		$searchText.eq(regionIndex).text(textPro+'/'+textCity+'/'+textSub);
	});


	//清楚地点
	$('.clear-addr').on('click',function(){
		var _index = $('.clear-addr').index($(this));
		if (_index==0) {
			j.StartProvince = 0;
			j.StarCity = 0;
			j.StartCounty = 0;
			$searchText.eq(0).text('请选择出发地');
		};
		if (_index==1) {
			j.EndProvince = 0;
			j.EndCity = 0;
			j.EndCounty = 0;
			$searchText.eq(1).text('请选择目的地');
		};
		return false;
	})
	//点击页面别的地方日历 和下拉框隐藏
  $(document).on('click',function(e){
      var target = $(e.target);
      //点击在日历里面的时候找他的祖先节点，找的到他的祖先节点长度是1；所以长度等于0的时候就是没找到，是在外面点击的
      if(target.closest(".city-picker-dropdown").length == 0){
         $('.city-picker-dropdown').hide();
      }
  });

	//点击 出发/目的地
	$searchRegion.on('click',function(){
		var _index = $(this).index();
		if (_index==0) {
			regionIndex = 0;
			$picker.css('top','325px');
		};
		if (_index==1) {
			regionIndex = 1;
			$picker.css('top','388px');
		};
		$picker.show();
		return false;
	})

	$('.search-btn').on('click',function(){
		//console.log(toParam(j));
		window.location.search = toParam(j);
	});

	$kinds.on('change',function(){
		j.CategoryId = $(this).val();
	})
	var mapTurn = true;
	$('.map-all-icon').on('click',function(){
		if (mapTurn) {
			mapTurn = !mapTurn;
			$('#main').css({
			    position: 'fixed',
			    zIndex: 1,
			    width: '100%',
			    height: '100%',
			    top: 0,
			    left: 0
			});
			var myChart = echarts.init(document.getElementById('main'));
			GetTop10HighwayIndexByMap();
			myChart.setOption(option);
		}else{
			mapTurn = !mapTurn;
			$('#main').css({
			        width: '609px',
				    height: '324px',
				    float: 'right',
				    position:'static'
			});
			var myChart = echarts.init(document.getElementById('main'));
			GetTop10HighwayIndexByMap();
			myChart.setOption(option);
		}

	})

	//点击激活当前选项
	function activeCurr(obj,p){
		if (p) {
			var $remove = obj.parents('.province');
		}else{
			var $remove = obj.parent();
		}
		$remove.find('a').removeClass('active');
		obj.addClass('active');
	}

	getRegionList($('.city'),109000238);
	getRegionList($('.district'),109000239);


	//获取省市列表
  function getRegionList(obj,id) {
    var str = '';
    $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId=' + id, function(data) {
      if (data && data.IsSuccess) {
      	console.log(data);
        var aList = data.Data;
        for (var i = 0, len = aList.length; i < len; i++) {
        	var oCode = aList[i].RegionCode;
          str += '<a data-id="'+aList[i].Id+'">'+aList[i].RegionName+'</a>';
        }
        str = '<a data-id="0">全部</a>' + str;
        obj.find('dd').html(str);
      }
    });
  }
  //json转参数
  function toParam(obj){
  	var str = '';
  	for(var key in obj){
  		str+= key+'='+obj[key]+'&';
  	}
  	str=str.substring(0,str.length-1)
  	return str;
  }

  //参数json化
  function toJson(str) {
    var arr = str.split('&');
    var oP = {};
    for (var i = 0; i < arr.length; i++) {
      var key = arr[i].split('=')[0];
      var value = arr[i].split('=')[1];
      oP[key] = value;
    };
    return oP;
  }
  getIndexList(oS);
  //获取公路指数列表
  function getIndexList(param, opts) {
    var json = param ? toJson(param) : {
      parm: ''
    };
    console.log(json);
    $.ajax({
      type: 'POST',
      url: '/api/RoadIndexApi/GetHighwayIndexList',
      // data to be added to query string:
      data: json,
      // type of data we are expecting in return:
      dataType: 'json',
      timeout: 3000,
      success: function(data) {
        console.log(data);
        var $tBody = $('.table-index-body');
        var str = '';
        if (data && data.IsSuccess) {
          var aList = data.Data;
          savaData = data.Data;
          if (savaData.length==0) {
          	alert('无当前线路!');
          };
          var len = aList.length;
          if (len < 10) {
            len = len;
          } else {
            len = 10;
          }
          for (var i = 0; i < len; i++) {
          	str+='<tr>'+
						'<td class="table-line">'+
							'<div class="table-place-wrap">'+
								'<p class="table-region">'+savaData[i].StarProvinceName+savaData[i].StartCityName+savaData[i].StartSubName+'</p>'+
								'<p class="table-name">'+savaData[i].BeginAddressName+'</p>'+
							'</div>'+
							'<span class="gap-line">——</span>'+
							'<div class="table-place-wrap">'+
								'<p class="table-region">'+savaData[i].EndProvinceName+savaData[i].EndCityName+savaData[i].EndSubName+'</p>'+
								'<p class="table-name">'+savaData[i].EndAddressName+'</p>'+
							'</div>'+
						'</td>'+
						'<td>'+savaData[i].CategoryName+'</td>'+
						'<td>'+savaData[i].CurrentPrice+'</td>'+
						'<td>'+savaData[i].TenantCount+'</td><td><a href="/RoadIndex/ctctChart?highwayIndexId=' + aList[i].Id + '&Begin=' + aList[i].BeginAddressName + '&End=' + aList[i].EndAddressName + '"><div class="line-chart"></div></a></td>'+
						'<td><a href="SendPackage"><button class="table-go-price">实时询价</button></a></td>'+
						'</tr>';
          }
          $tBody.html(str);
          setPages(savaData.length);
        }
      }
    });
  }

  getCategory();
  //获取煤炭种类
  function getCategory() {
    var str = '';
    $.get('/api/RoadIndexApi/GetSCategoryList', function(data) {
      if (data && data.IsSuccess) {
        var aList = data.Data;
        for (var i = 0, len = aList.length; i < len; i++) {
          str += '<option value="' + aList[i].Id + '">' + aList[i].CategoryName + '</option>';
        }
        str = '<option value="0">请选择煤品</option>' + str;
        //console.log(str);
        $kinds.html(str);
      }

    });
  }

  function getLocalData(page){
  	var startIndex = page * 10;
  	var endIndex = (page+1)* 10;
  	var str = '';
  	if (endIndex > savaData.length) {
  	  endIndex = savaData.length;
  	};
    for (var i = startIndex; i < endIndex; i++) {
    	str+='<tr>'+
			'<td class="table-line">'+
				'<div class="table-place-wrap">'+
					'<p class="table-region">'+savaData[i].StarProvinceName+savaData[i].StartCityName+savaData[i].StartSubName+'</p>'+
					'<p class="table-name">'+savaData[i].BeginAddressName+'</p>'+
				'</div>'+
				'<span class="gap-line">——</span>'+
				'<div class="table-place-wrap">'+
					'<p class="table-region">'+savaData[i].EndProvinceName+savaData[i].EndCityName+savaData[i].EndSubName+'</p>'+
					'<p class="table-name">'+savaData[i].EndAddressName+'</p>'+
				'</div>'+
			'</td>'+
			'<td>'+savaData[i].CategoryName+'</td>'+
			'<td>'+savaData[i].CurrentPrice+'</td>'+
			'<td>'+savaData[i].TenantCount+'</td><td><a href="/RoadIndex/ctctChart?highwayIndexId=' + savaData[i].Id + '&Begin=' + savaData[i].BeginAddressName + '&End=' + savaData[i].EndAddressName + '"><div class="line-chart"></div></a></td>'+
			'<td><a href="SendPackage"><button class="table-go-price">实时询价</button></a></td>'+
			'</tr>';
    }
    $tBody.html(str);
  }

  function setPages(totalNum){
  	  $("#page").page({
  	  	total:totalNum,
  	  	pageSize:10,
  	  	pageBtnCount:11,
  	  	showJump:true
  	  }).on("pageClicked", function (event, pageNumber) {
  	    getLocalData(pageNumber);
  		}).on('jumpClicked', function (event, pageIndex) {
         getLocalData(pageIndex);
     })
  }

})();
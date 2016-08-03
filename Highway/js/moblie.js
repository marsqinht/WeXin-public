;(function(){
  var $startProv = $('.list-province_start');
  var $startCity = $('.list-city_start');
  var $startArea = $('.list-area_start');
  var $endProv = $('.list-province_end');
  var $endCity = $('.list-city_end');
  var $endArea = $('.list-area_end');
  var $startWrap = $('.start-wrap');
  var $endWrap = $('.end-wrap');
	getIndexList();
	  //获取公路指数列表
  function getIndexList(param,opts){
    var json = param?toJson(param):{ parm:'' };
    //console.log(json);
    $.ajax({
      type: 'POST',
      url: '/api/RoadIndexApi/GetHighwayIndexList',
      // data to be added to query string:
      data: json,
      // type of data we are expecting in return:
      dataType: 'json',
      timeout: 30000,
      success: function(data){
        var str = '';
        if (data && data.IsSuccess) {
          $.hideLoading();
          $.toast('搜索成功');
          var html = template('test', data);
          $('.line-wrap').html(html);
        }
      }
    });
 }

  $('.line-wrap').on('tap','.new-order-btn',function(){
    var oSearch= $(this).attr('data-set');
    var singleParam = oSearch.split('&');
    var begin = decodeURIComponent(singleParam[1].split('=')[1]);
    var end = decodeURIComponent(singleParam[2].split('=')[1]);
    $('#chart-title').html(begin+' 到 '+end);
    getCharts(oSearch,begin,end);
  })

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

  /**
   * 获取煤炭种类
   * @return {[type]} [description]
   */
  var getCategory = function (){
    var $kinds =$('#category-list');
    var str = '';
	   $.get('/api/RoadIndexApi/GetSCategoryList',function(data){
	      if (data && data.IsSuccess) {
	      	var html = template('tpl-category', data);
          $('#category-kinds').html(html);
	      }

    });
  }();

  //获取省市列表
  function getRegionList(obj,id){
    var str = '';
    $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId='+id,function(data){
        if (data && data.IsSuccess) {
          console.log(data)
          var html = template('tpl-region',data);
            html ='<option value="0">全部</option>'+html;
          obj.html(html);
        }
    });
  }

  getRegionList($('.list-province_start,.list-province_end'),109000000);

$startProv.on('change',function(){
    getRegionList($startCity,$(this).val());
  })
$startCity.on('change',function(){
  getRegionList($('.list-area_start'),$(this).val());
})
$endProv.on('change',function(){
    getRegionList($endCity,$(this).val());
  })
$endCity.on('change',function(){
  getRegionList($('.list-area_end'),$(this).val());
})

  $('.search-btn').on('tap',function(){
  	var oF = $('#search-from').serialize();
  	console.log(oF);
    $.showLoading('正在搜索');
    getIndexList(oF)
  	return false;
  })

  $('.search-region-btn_start').on('tap',function(){
      var oStart = getOption($startProv)+' '+getOption($startCity)+' '+getOption($startArea);
      console.log(oStart);
      $startWrap.html(oStart)
      closePop();
  })
  $('.search-region-btn_end').on('tap',function(){
      var oEnd = getOption($endProv)+' '+getOption($endCity)+' '+getOption($endArea);
      console.log(oEnd);
      $endWrap.html(oEnd);
      closePop();
  });

  function getOption(obj){
    var vals = '';
    obj.find('option').each(function(index,elem){
      if ($(elem).attr('selected')) {
        vals = $(elem).html();
      };
    })
    return vals;
  }

  function closePop(c,remove){
    $(".weui-popup-modal-visible").removeClass("weui-popup-modal-visible").transitionEnd(function() {
        var $this = $(this);
        $this.parent().removeClass("weui-popup-container-visible");
        $this.trigger("close");
        remove && $this.parent().remove();
      })
  }



  function getCharts(oSearch,begin,end){
    $.ajax({
     type: 'GET',
     url: '/api/RoadIndexApi/GetHighwayIndexHistoryPriceList?'+oSearch,
     dataType: 'json',
     timeout: 3000,
     success: function(data){
       //var $tBody = $('#highway-index-tbody');
       if (data && data.IsSuccess) {
         var aList = data.Data;
         var time =[];
         var price = [];
         for (var i = 0,len=aList.length; i < len; i++) {
           time.push(aList[i].CreateTime);
           price.push(aList[i].Price);
         };
         var myChart = echarts.init(document.getElementById('chart-wrap'));
          // 指定图表的配置项和数据
          option = {
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data:['综合历史价格']
              },
              grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
              },
              toolbox: {
                  feature: {
                      saveAsImage: {}
                  }
              },
              xAxis: {
                  name: '时间',
                  type: 'category',
                  boundaryGap: false,
                  data: time
              },
              yAxis: {
                  name: '价格(元/吨)',
                  type: 'value'
              },
              series: [
                  {
                      name:'综合历史价格',
                      type:'line',
                      stack: '总量',
                      data:price
                  }
              ]
          };
           // 使用刚指定的配置项和数据显示图表。
           myChart.setOption(option);
       };
     }
   });
  }

})();
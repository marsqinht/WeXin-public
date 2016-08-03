;(function(){
  var oSearch = window.location.search.substring(1);
  var singleParam = oSearch.split('&');
  var begin = decodeURIComponent(singleParam[1].split('=')[1]);
  var end = decodeURIComponent(singleParam[2].split('=')[1]);

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
              title: {
                  text: ''+begin+'——'+end+''
              },
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

})();

$(function() {
    var $tableWrap =$('#order-index-tbody');
    //var oData = {};
    var allIndex = 0;
    var loadIndex = 0;
    var status = '';
    //var loadData = {};
    var oSearch = location.search?location.search.substring(1):'packageCode=&vehicleNo=&startTime=&endTime=';
    console.log(oSearch);
    if (oSearch) {
      var param = toJson(oSearch);
      $('#my-startDate').text(param.startTime);
      $('.searh-start-date').val(param.startTime);
      $('#my-endDate').text(param.endTime);
      $('.searh-end-date').val(param.endTime);
    };
    //判断搜索开始结束日期
    var startDate = new Date();
    var endDate = new Date();
    var $alert = $('#my-alert');
    $('#my-start').datepicker().
      on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() > endDate.valueOf()) {
          $alert.find('p').text('开始日期应小于结束日期！').end().show();
        } else {
          $alert.hide();
          startDate = new Date(event.date);
          $('#my-startDate').text($('#my-start').data('date'));
          $('.searh-start-date').val($('#my-start').data('date'));
        }
        $(this).datepicker('close');
      });

    $('#my-end').datepicker().
      on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() < startDate.valueOf()) {
          $alert.find('p').text('结束日期应大于开始日期！').end().show();
        } else {
          $alert.hide();
          endDate = new Date(event.date);
          $('#my-endDate').text($('#my-end').data('date'));
          $('.searh-end-date').val($('#my-end').data('date'));
        }
        $(this).datepicker('close');
      });

  //按照筛选条件搜索
  $('.seacrh-btn').on('click',function(){
    var oF = $('#search-list_form').serialize();
    console.log(oF);
    allIndex = 0;
    loadIndex = 0;
    if (!status) {
      getList(oF,allIndex,status,$('#order-all-pages'));
    }else{
      loadingList(oF,loadIndex,status,$('#order-load-pages'));
    }

  });

  //tab切换
  $('.order-tab').on('click',function(){
    var _index = $('.order-tab').index($(this));
    console.log(_index);
    if (_index == 0) {
      status = '';
    }else{
      status = 6;
      //loadingList(oSearch,loadIndex,$('#order-all-pages'));
    }

  });

  //获取订单
  function getList(seacrh,index,status,p){
    //console.log(pp)
    $.get('/api/CTCTC/TrackApi/GetTicketList/?'+seacrh+'&pageIndex='+index+'&pageSize=10'+'&ticketStatus='+status,function(data){
      console.log(data);
      if (data && data.IsSuccess) {
        var pageCount = Math.ceil(data.TotalCount/10);
        var oData = data.Data;
        var html = '';
        for (var i = 0; i < oData.length; i++) {
          html+='<tr>'+
                '<td>'+(index*10+i+1)+'</td>'+
                '<td>'+oData[i].TicketCode+'</td>'+
                '<td>'+oData[i].VehicleNo+'</td>'+
                '<td>'+oData[i].CategoryName+'</td>'+
                '<td>'+oData[i].TicketWeightInit+'</td>'+
                '<td>'+oData[i].TicketWeightReach+'</td>'+
                '<td>'+oData[i].CreateTime.split('T')[0]+'</td>'+
                '<td><a href="OrderDetails?ticketId='+oData[i].TicketId+'" class="list-operate">查看</a></td>'+
                '</tr>';
        };
        //obj.html(html);
        $tableWrap.html(html);
        p && setPages(p,pageCount);
      };
    })
  }


  /*function getLocalData(obj,data,index){
    var html='';
    //var end = (index+1)*10<=data.length?(index+1)*10:data.length;
    for (var i = 0; i < data.length; i++) {
      html+='<tr>'+
            '<td>'+(i+index*10)+'</td>'+
            '<td>'+data[i].TicketCode+'</td>'+
            '<td>'+data[i].VehicleNo+'</td>'+
            '<td>'+data[i].CategoryName+'</td>'+
            '<td>'+data[i].TicketWeightInit+'</td>'+
            '<td>'+data[i].TicketWeightReach+'</td>'+
            '<td>'+data[i].CreateTime.split('T')[0]+'</td>'+
            '<td><a href="OrderDetails?ticketId='+data[i].TicketId+'" class="list-operate">查看</a></td>'+
            '</tr>';
    };
    obj.html(html);
  }*/
  //loadingList();
  //$('#order-load-tbody') $('#order-load-pages')
  function loadingList(seacrh,index,status,p){
    $.get('/api/CTCTC/TrackApi/GetTicketList/?'+seacrh+'&pageIndex='+index+'&pageSize=10'+'&ticketStatus='+status,function(data){
          console.log(data);
          if (data && data.IsSuccess) {
            var pageCount = Math.ceil(data.TotalCount/10);
            var lData = data.Data;
            var html = '';
            for (var i = 0; i < lData.length; i++) {
              html+='<tr>'+
                    '<td>'+(i+index*10+1)+'</td>'+
                    '<td>'+lData[i].TicketCode+'</td>'+
                    '<td>'+lData[i].VehicleNo+'</td>'+
                    '<td>'+lData[i].CategoryName+'</td>'+
                    '<td>'+lData[i].TicketWeightInit+'</td>'+
                    '<td>'+lData[i].TicketWeightReach+'</td>'+
                    '<td>'+lData[i].CreateTime.split('T')[0]+'</td>'+
                    '<td><a href="OrderDetails?ticketId='+lData[i].TicketId+'" class="list-operate">查看</a></td>'+
                    '</tr>';
            };
            //obj.html(html);
            $('#order-load-tbody').html(html);
            p && setLoadPages(p,pageCount);
          };
        })
  }

  //设置页数
  function setPages(container,num){
    var pagination = new Pagination({
      wrap: container, // 存放分页内容的容器
      count: num, // 总页数
      current: 1, // 当前的页数（默认为1）
      prevText: '上一页', // prev 按钮的文本内容
      nextText: '下一页', // next 按钮的文本内容
      callback: function(page) { // 每一个页数按钮的回调事件
          loadIndex = (page-1)*10;
         getList(oSearch,page-1)
      },
      success: function(result) {
        // result 成功返回的结果
      },
      error: function(error) {
        // error 失败返回的 message
      }
    });
  }

  function setLoadPages(container,num){
    var loadPages = new Pagination({
      wrap: container, // 存放分页内容的容器
      count: num, // 总页数
      current: 1, // 当前的页数（默认为1）
      prevText: '上一页', // prev 按钮的文本内容
      nextText: '下一页', // next 按钮的文本内容
      callback: function(page) { // 每一个页数按钮的回调事件
        //loadIndex  = (page-1)*10;
        //loadingList(oSearch,loadIndex,status,p)
        loadingList(oSearch,page-1);
      },
      success: function(result) {
        // result 成功返回的结果
      },
      error: function(error) {
        // error 失败返回的 message
      }
    });
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
  console.log(oSearch)
  getList(oSearch,allIndex,status,$('#order-all-pages'));
  loadingList(oSearch,loadIndex,6,$('#order-load-pages'));

});
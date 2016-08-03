;(function(){
var $popWrap = $('#popup-points-wrap');
var $startPick = $("#start-city-picker");
var $endPicker = $("#end-city-picker");
var $setPicker = $("#set-city-picker");
var $single = $('#start-end-popup').find('.modal-content_self').find('.weui_cell_ft');
var $hasClick = null;
var changeIndex = 0;
var region = [];
var oSearch = window.location.search.substring(1);
var regionVal = '山西 太原 小店区';
var turnOff = false;
var sORe =0;
var rId = {
  pro:109000238,
  city:109000239,
  area:109000241
}
var aData={};
var startId ={};
var endId = {};
var sIndex= 0;
$('#id-input').val(oSearch.split('=')[1]);
$startPick.on('tap',function(){
  cheack($(this));
  changeIndex = 0;
});
$endPicker.on('tap',function(){
  cheack($(this));
  changeIndex = 1;
});
$setPicker.on('tap',function(){
  cheack($(this));
  changeIndex = 2;
});
$('.turn-it-off').on('tap',function(){
   turnOff = false;
})

$startPick.cityPicker({
    title: "请选择出发地点"
  });

$endPicker.cityPicker({
    title: "请选择目的地点"
  });

$setPicker.cityPicker({
    title: "请选择公共点位置"
  });
    //添加报价信息

$('.ponit-add').on('tap',function(){
  var oF = $('#add-road').serialize();
  var addParm = oF+'&PointAProvinceRegionId='+startId.pro+'&PointACityRegionId='+startId.city+
                '&PointASubRegionId='+startId.area+'&PointBProvinceRegionId='+endId.pro+
                '&PointBCityRegionId=' + endId.city + '&PointBSubRegionId=' + endId.area;
   console.log(addParm);
  if (!$('#price-input').val()) {
    $.toast("请输入价格", "forbidden");
    return
  };
  if (!$('#mile-input').val()) {
    $.toast("请输入路线里程", "forbidden");
    return
  };


  $.post('/api/RoadIndexApi/AddLine',addParm,function(data){
    console.log(data);
    if (data && data.IsSuccess) {
      GetTenantLinePricesList();
      $.toast('添加成功');
    }else{
      var oDa = JSON.parse(data);
      $.toast(oDa.Message || "添加失败", "forbidden");
    }
  })
});

$('.btn-points').on('tap',function(){
  //$('#popup-points-wrap').find('.weui-popup-modal');
  sORe = $('.btn-points').index($(this));
  $('#popup-points-wrap').find('.clear-items').val('');
  $setPicker.val(regionVal);
  //$popWrap.popup();
});

$popWrap.on('tap','.add-points-btn',function(){
  var name = $popWrap.find('input[name="PublicPointName"]').val();
  var areaval = $setPicker.val();
  var pForm = $popWrap.find('.subimt-point').serialize()+'&ProvinceRegionId='+rId.pro+
              '&CityRegionId='+rId.city+'&SubRegionId='+rId.area;
  console.log(pForm);
  if (!name) {
    $.toast("请输入公共点名称", "forbidden");
    return;
  };

  addPoints(pForm);


});

//开始地区,结束地区
$startPick.on('change',function(){
  regionVal = $(this).val();
});
$endPicker.on('change',function(){
 regionVal = $(this).val();
})

$('#all-points-wrap').on('tap','.del-btn',function(){
  var $oParent = $(this).parent();
  var oId = $(this).attr('data-id');
  $.confirm("是否确定删除当前路线?", function() {
     //点击确认后的回调函数
    $.get('/api/RoadIndexApi/Delete?Id='+oId,function(data){
      if (data && data.IsSuccess) {
       // console.log(data)
        $oParent.remove();
        $.toast('删除成功');
      };
    })
  }, function() {
  //点击取消后的回调函数
  });


});

$('#all-points-wrap').on('tap','.weui_cell_primary',function(){
  var _index = $(this).attr('data-index');
  var oD = aData[_index];
  //console.log(oD);
  var Mei = oD.CategoryName==null?"不限":oD.CategoryName;
  console.log(Mei)
  var aSingleDetail = [''+oD.CommonPointAProvinceName+' '+oD.CommonPointACityName+''+oD.CommonPointASubName+'',
    oD.CommonPointAName,
    ''+oD.CommonPointBProvinceName+' '+oD.CommonPointBCityName+''+oD.CommonPointBSubName+'',
    oD.CommonPointBName,
    Mei,
    oD.CurrentPrice,
    oD.Mileage,
    oD.TenantName,
    oD.CreateTime,
    oD.Memo
  ];
  for (var i = 0; i < $single.length; i++) {
    $single.eq(i).html(aSingleDetail[i]);
  };

});

$(document).on('tap',function(){
  if ($('.weui-picker-container').length!=0) {
    //console.log(1)
    covertRegion($hasClick);
  };
})
/*$('body').on('tap','.close-picker',function(){
    if (turnOff) {
      covertRegion($hasClick);

    };
});*/
$('.add-btn-wrap').on('tap',function(){
    sIndex = $('.add-btn-wrap').index($(this));
  if (sIndex==0) {
    changeIndex = 0;
    $setPicker.val($startPick.val());
    console.log(startId)
    rId = startId;
    covertRegion($startPick);
  };
  if (sIndex==1) {
    changeIndex=1;
    $setPicker.val($endPicker.val());
    covertRegion($endPicker);
    rId = endId;
  };
})

$('#start-point').on('change',function(){
  var aReList = $(this).attr('data-values').split(' ');
  //getRegionList(aReList[2]);
});

//getAllpoints();
getRegionList(109000000);
GetCategoryList();
GetTenantLinePricesList();
//getRoadList(0,3);
function getAllpoints(){
    $.get('/api/RoadIndexApi/GetAllPoint',function(data){
      if (data && data.IsSuccess) {
        var pList =data.Data;
        console.log(pList);
        var op = '';
        //var arr = [];
        for (var i = 0; i < pList.length; i++) {
          op+='<option value="'+pList[i].Id+'">'+pList[i].PublicPointName+'</option>';
        }
        //console.log(op);
        $('.common-wrap').html(op);
      }
    });
  }

  //获取地区列表
  function getRegionList(r){
    $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId='+r,function(data){
      if (data && data.IsSuccess) {
        console.log(data);
        region = data.Data;
      }

    });
  }

  function cheack(obj){
    turnOff = true;
    $hasClick = obj;
  }

  //添加公共点
  function addPoints(param){
    $.post('/api/RoadIndexApi/AddPoin',param,function(data){

      if (data && data.IsSuccess){
        $.toast('添加成功');
        //getAllpoints();
        if (sORe==0) {
          $startPick.val($setPicker.val());
          startId = rId;
        };
        if (sORe==1) {
          $endPicker.val($setPicker.val());
          endId = rId;
        };
        console.log(changeIndex)
        getPoint('ProvinceRegionId='+rId.pro+'&CityRegionId='+rId.city+'&SubRegionId='+rId.area);
        $.closePopup();
      }else{
         var oData = JSON.parse(data)
        $.toast(oData.Message || "操作失败", "forbidden");
      }
    })
  };



  function GetTenantLinePricesList(){
    $.get('/api/RoadIndexApi/GetTenantLinePricesList?'+oSearch,function(data){
      if (data && data.IsSuccess) {
        aData = data.Data;
        var html = '';
        for (var i = 0; i < aData.length; i++) {
          var kindsName = aData[i].CategoryName==null?'不限':aData[i].CategoryName;
          html += '<div class="weui_cell">'+
                   '<div class="weui_cell_bd weui_cell_primary" data-index='+i+'>'+
                   '<a href="javascript:;" class="open-popup" data-target="#start-end-popup"><p>'+aData[i].CommonPointAName+'<i class="fa fa-long-arrow-right"></i>'+aData[i].CommonPointBName+'&nbsp&nbsp '+kindsName+'&nbsp&nbsp '+aData[i].CurrentPrice+'</p></a>'+
                   '</div>'+
                   '<div class="weui_cell_ft del-btn" data-id='+aData[i].Id+'>删除</div>'+
                 '</div>';
        }
        $('#all-points-wrap').html(html);
      }
    });
  }


  function getPointType(){
    $.get('/api/RoadIndexApi/GetPublicPointType',function(data){
      if (data && data.IsSuccess) {
        var html = '';
        for (var i = 0; i < data.Data.length; i++) {
          html+='<option value="'+data.Data[i].Id+'">'+data.Data[i].Text+'</option>'
        };
        $('.select-pointType').html(html);
      };

    })
  }
  getPointType();
  //根据省市Id获取公共点
  function getPoint(id){
    var pointParam ='';
    if (changeIndex==0) {
       pointParam = '&PPointType=101';
    };
    if (changeIndex==1) {
       pointParam = '&PPointType=102';
    };
    if (changeIndex==2) {
        if (sORe==0) {
         pointParam = '&PPointType=101';
        };
        if (sORe==1) {
           pointParam = '&PPointType=102';
        };

    }
    console.log(id+pointParam)
    $.post('/api/RoadIndexApi/GetPoint',id+pointParam,function(data){
      if (data && data.IsSuccess) {
        var pList =data.Data;
        //console.log(pList);
        var op = '';
        //var arr = [];
        for (var i = 0; i < pList.length; i++) {
          op+='<option value="'+pList[i].Id+'">'+pList[i].PublicPointName+'</option>';
        }
       // console.log(op);
        if (changeIndex==0) {
           $('.common-wrap').eq(0).html(op);
        };
        if (changeIndex==1) {
           $('.common-wrap').eq(1).html(op);
        };
        if (changeIndex==2) {
            if (sORe==0) {
              $('.common-wrap').eq(0).html(op);
            };
            if (sORe==1) {
              $('.common-wrap').eq(1).html(op);
            };

        }


      }
    });
  }
  //获取煤品种类
  function GetCategoryList(){
    $.get('/api/RoadIndexApi/GetSCategoryList',function(data){
      if (data && data.IsSuccess) {
       var pList =data.Data;
        console.log(pList);
        var op = '';;
        for (var i = 0; i < pList.length; i++) {
          op+='<option value="'+pList[i].Id+'">'+pList[i].CategoryName+'</option>';
        }
        $('.mei-wrap').html(op);
      }

    });
  }

      //参数转成json
    function toJson(str){
      var oJson = {};
      var arr = str.split('&');
      for (var i = 0; i < arr.length; i++) {
        var single = arr[i].split('=');
        oJson[single[0]]=single[1];
      };
      return oJson;
    }

  function getRoadList(index,size){
    var json = {
      PageIndex : index,
      PageSize :size
    };
    $.ajax({
      type: 'POST',
      url: '/api/RoadIndexApi/GetHighwayIndexList',
      // data to be added to query string:
      data: json,
      // type of data we are expecting in return:
      dataType: 'json',
      timeout: 3000,
      success:function(data){
        //console.log(data)
      }
    });
  }
  function covertRegion(obj){
    var oVal = obj.val();

    console.log(obj)
    var IDname = obj.attr('id');
    var isAll = true;
    var aRegion = oVal.split(' ');
    var Len = region.length;
    if (IDname=='start-city-picker'){startId={};};
    if (IDname=='end-city-picker') {endId ={};};
    rId = {};
    regionVal = oVal;
    //console.log(aRegion);
    var province = new RegExp(aRegion[0]);
    for (var i = 0; i < Len; i++) {
      if (province.test(region[i].RegionName)) {
          isAll = true;
          rId.pro = region[i].Id;
          if (IDname=='start-city-picker'){
            startId.pro =region[i].Id;
          };
          if (IDname=='end-city-picker') {
            endId.pro= region[i].Id;
          };
          getPoint('ProvinceRegionId='+rId.pro);
          //console.log(rId);
          $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId='+region[i].Id,function(data){
            if (data && data.IsSuccess) {
              var oCity = data.Data;
              var testCity = new RegExp(aRegion[1]);
              for (var j = 0; j < oCity.length; j++) {
                if (testCity.test(oCity[j].RegionName)) {
                   // console.log(oCity[j].RegionName);
                    rId.city=oCity[j].Id;
                    //console.log(1)
                    if (IDname=='start-city-picker'){
                      startId.city =oCity[j].Id;
                    };
                    if (IDname=='end-city-picker') {
                      endId.city = oCity[j].Id;

                    };
                    isAll = false;
                    //console.log(rId);

                   getPoint('ProvinceRegionId='+rId.pro+'&CityRegionId='+rId.city);
                    $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId='+oCity[j].Id,function(data){
                      if (data && data.IsSuccess) {
                        var oArea = data.Data;
                        var testArea = new RegExp(aRegion[2]);
                        for (var k = 0; k < oArea.length; k++) {
                          if (testArea.test(oArea[k].RegionName)) {
                             // console.log(oArea[k].RegionName);
                              rId.area = oArea[k].Id;
                              console.log(2)
                              if (IDname=='start-city-picker'){
                                startId.area = oArea[k].Id;

                              };
                              if (IDname=='end-city-picker') {
                                endId.area = oArea[k].Id;
                              };
                              //console.log(rId)
                              //console.log(startId,endId,rId)
                              getPoint('ProvinceRegionId='+rId.pro+'&CityRegionId='+rId.city+'&SubRegionId='+rId.area);

                          };
                        };
                      }

                    });

                };
              };

            }
          });
      }
    };
  }
})();
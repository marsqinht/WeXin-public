var a = 0;
;(function(){
	//左右滑动
  var oPage = 0;

  if (location.search) {
    oPage = parseFloat(location.search.split('=')[1]);
  }else{
    oPage = sessionStorage.num?sessionStorage.num:0;
  }
	TouchSlide({ slideCell:"#leftTabBox",
         defaultIndex:oPage,
  			 endFun:function(i){ //高度自适应
  			 	a = i;
          sessionStorage.num = i;
  				var bd = document.getElementById("tabBox1-bd");
  				//console.log(bd.children[i])
          $('html,body').scrollTop(0);
          var oH = bd.children[i].children[1].offsetHeight<500?500:bd.children[i].children[1].offsetHeight;
  				bd.parentNode.style.height = oH + 50 +"px";
          $('#load-mine').removeClass('refresh-had');
  				if(i>0)bd.parentNode.style.transition="200ms";//添加动画效果
  			 }
			});
})();
;(function(){
	var $regionUp = $('#search-city'),
			$province = $regionUp.find('.list-province'),//省份select
			$city = $regionUp.find('.list-city'),//城市
			$area = $regionUp.find('.list-area'),//地区
			$regionBtn = $regionUp.find('.search-region-btn'),//确定按钮
      oF = 'pId=&cId=&subId=',
      p = {
        one:0,
        two:0,
        three:0
      },
      loading = false,mineTurn = true,newTurn = true,advTurn = true;
  var $packPopUp = $('#pack-price'),//更新价格弹框
      $updataBtn = $packPopUp.find('.pack-update-btn'),//确定更新
      $oForm = $('#pack-update-form'),
      upId = '',
      $item = '',
      totalCar = 100,
      $loadNew = $('#load-new'),
      $loadAdv = $('#load-adv'),
      $loadMine = $('#load-mine');

	//获取省市列表
  function getRegionList(obj,id,shanxi){
    var str = '';
    $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId='+id,function(data){
        if (data && data.IsSuccess) {
          var aList = data.Data;
          for (var i = 0,len=aList.length; i < len; i++) {
            str+='<option value="'+aList[i].Id+'">'+aList[i].RegionName+'</option>';
          }
          str = '<option value=" ">全部</option>'+str;
          id==109000000?obj.append(str):obj.html(str);
        }
    });
  }
  //获取地区列表
  function getAreaList(obj,id,shanxi){
    $.get('/api/InfoDepartApi/GetSRegionListByParentId?ParentId='+id,function(data){
      //console.log(data);
      if (data && data.IsSuccess) {
        var html = template('tpl-region',data);
        if (id == 109000000 ) {
          html = '<option value="0">所有</option>'+html;
        }else{
          html = '<option value="0">不限</option>'+html;
        }
        obj.html(html);
        if (shanxi) {
          $province.find('option').each(function(i,elem){
            if ($(elem).val()=='109000238') {
              $(elem).attr('selected','selected');
            };
          })
        };
      };
    })
  };
  getAreaList($province,109000000,1);
  getAreaList($city,109000238);

  $province.on('change',function(){
    var oCode = $(this).val();
    getAreaList($city,oCode);
  });

  $city.on('change',function(){
    var oCode = $(this).val();
    getAreaList($area,oCode);
  });

  $regionBtn.on('tap',function(){
    var regionVal = getOptionText($province)+' '+getOptionText($city)+' '+getOptionText($area);
    oF =$('#region-form').serialize();
    $('#list-region_text').text(regionVal);
    closePop();
    $.showLoading('正在搜索中');
    getNewPack(0,10,oF,'html');
  });

  $('.list-seacrh_btn').on('tap',function(){
    $.showLoading('正在搜索中');
    getNewPack(0,10,oF,'html');
  })

  getNewPack(0,10,'pId=&cId=&subId=');
  getAdvPack(0,10,'pId=&cId=&subId=');
  getMyOrder(0,10);
  $('#load-mine').pullToRefresh().on("pull-to-refresh", function() {
       console.log(111)
       getMyOrder(0,10,'aa');
  });

  $('#load-new').pullToRefresh().on("pull-to-refresh", function() {
       getNewPack(0,10,'pId=&cId=&subId=','sss');

  });

  $('#load-adv').pullToRefresh().on("pull-to-refresh", function() {
       getAdvPack(0,10,'pId=&cId=&subId=','aa');
  });
  //最新货源列表
  function getNewPack(index,size,regionId,html){
    $.get('/api/InfoDepartApi/GetVPackage?pageIndex='+index+'&pageSize='+size+'&'+regionId,function(data){
        console.log(data);
        if (data && data.IsSuccess) {
          $.hideLoading();
          $loadNew.pullToRefreshDone();
          loading = false;
          var sHtml = template('tpl-new',data);
          if (html) {
            $('.trade-new_container').html(sHtml);
            p.one = 0;
          }else{
            $('.trade-new_container').append(sHtml);
          }
          $('.weui-infinite-scroll').hide();
          var bd = document.getElementById("tabBox1-bd");
          bd.parentNode.style.height = bd.children[0].children[1].offsetHeight+50+"px";
          if (data.Data.length == 0 && newTurn) {
            newTurn = false;
            $('.weui-infinite-scroll').eq(0).remove();
            $('.trade-latest_wrap').append('<div class="loading-tips">已全部加载完毕!</div>');
          };

        }else{
          $loadNew.pullToRefreshDone();
          var error = JSON.parse(data);
          $.hideLoading();
          $.toast('最新活源：'+error.Message,'forbidden');
        }
    });
  }

  //获取被选中option的值
  function getOptionText(obj){
    var val = '';
    obj.find('option').each(function(index,el){
      if ($(el).prop('selected')) {
        val = $(el).html();
        if (val=='不限') {
          val='';
        };
      };
    })
    return val;
  }

  $(window).on('scroll',function(){
    if($(window).scrollTop() == 0){
        $loadMine.removeClass('refresh-had');
        $loadNew.removeClass('refresh-had');
        $loadAdv.removeClass('refresh-had');
    }else{
      $loadMine.addClass('refresh-had');
      $loadNew.addClass('refresh-had');
      $loadAdv.addClass('refresh-had');
    }
  })
  function getAdvPack(index,size,regionId,html){
  $.get('/api/InfoDepartApi/GetVPackageInAdvantageLine?pageIndex='+index+'&pageSize='+size+'&'+regionId,function(data){
      console.log(data);
      if (data && data.IsSuccess) {
        $loadAdv.pullToRefreshDone();
        loading = false;
        var sHtml = template('tpl-adv',data);
        if (html) {
          p.two = 0;
          $('.trade-advantage_wrap').html(sHtml);
        }else {
          $('.trade-advantage_wrap').append(sHtml);
        }

        $('.weui-infinite-scroll').hide();
        var bd = document.getElementById("tabBox1-bd");
        bd.parentNode.style.height = bd.children[1].children[1].offsetHeight+50+"px";
        if (data.Data.length == 0 && advTurn) {
          advTurn = false;
          $('.weui-infinite-scroll').eq(1).remove();
          $('.trade-advantage_wrap').append('<div class="loading-tips">已全部加载完毕!</div>');
        }
      }else{
          $loadAdv.pullToRefreshDone();
          var error = JSON.parse(data);
          $.toast('优势路线：'+error.Message,'forbidden');
        }
  });
  }

  function getMyOrder(index,size,fresh){
    $.get('/api/InfoDepartApi/GetMyOrder?pageIndex='+index+'&pageSize='+size,function(data){
        console.log(data);
        if (data && data.IsSuccess) {
          $('#load-mine').pullToRefreshDone();
          loading = false;
          var sHtml = template('tpl-my',data);
          if (fresh) {
               p.three = 0;
               $('#load-mine').addClass('refresh-had');
               $('.trade-mine_wrap').html(sHtml);
            }else{
               console.log('aaa')
               $('.trade-mine_wrap').append(sHtml);
            }
          $('.weui-infinite-scroll').hide();
          var bd = document.getElementById("tabBox1-bd");
          bd.parentNode.style.height = bd.children[2].children[1].offsetHeight+50+"px";
          if (data.Data.length == 0 && mineTurn) {
            mineTurn = false;
            $('.weui-infinite-scroll').eq(2).remove();
            $('.trade-mine_wrap').append('<div class="loading-tips">已全部加载完毕!</div>');
          };
                console.log($(window).scrollTop())
                if($(window).scrollTop()==0){
              $('#load-mine').removeClass('refresh-had');
          }
        }else{
         $('#load-mine').pullToRefreshDone();
         $('#load-mine').addClass('refresh-had');
            var error = JSON.parse(data);
            $.toast('我的订单：'+error.Message,'forbidden');
          }
    });
  }
  //更新报价
    function uadatePrice(upId){
        var oF = $oForm.serialize();
        var $aIn = $('#pack-update-form').find('input');
        var upPrice = $aIn.eq(0).val();
        var upCar = $aIn.eq(1).val();
        if (!/^[0-9]+\.?[0-9]{0,4}$/.test(upPrice)) {
          $.toast('请输入正确报价!','forbidden');
          return;
        };
        if (parseFloat(upCar)>parseFloat(totalCar)) {
            $.toast('报价车数超过上限!','forbidden');
            return;
          };
        if (!/^\+?[1-9]\d*$/.test(upCar)) {
          $.toast('车数必须为正整数!','forbidden');
          return;
        };
        var j = toJson(oF);
        console.log($item);
        $.showLoading('正在议价中');
      $.get('/api/InfoDepartApi/ApplyPackage?'+upId+'&'+oF,function(data){
        console.log(data);
        if (data && data.IsSuccess) {
          $.hideLoading();
          $.toast('议价成功',function(){
            $item.find('.order-info_price').html(j.price);
            $item.find('.order-info_car').html(j.cartCount);
          });
        }else{
            $.hideLoading();
            $.toast(data.Message || '修改失败','forbidden');
          }
      })
      closePop();
      cearVal();
    }

    function cearVal(){
      $oForm.find('input').val('');
    }

    $updataBtn.on('tap',function(){
      uadatePrice(upId)
    });
    $(document).on('tap','.my-up-btn',function(){
      $item = $(this).closest('.trade-order-item');
      totalCar = $(this).attr('data-car');
      console.log(totalCar)
      var oPrice = $item.find('.order-info_price').html();
      var oCount =  $item.find('.order-info_car').html();
      var $aInput = $('#pack-update-form').find('input');
      $aInput.eq(0).val(oPrice);
      $aInput.eq(1).val(oCount);
      upId = $(this).attr('data-id');
    })
    /*$(document.body).on('touchmove',function(){
      console.log($('#load-mine').scrollTop());
    })
    console.log($('#load-mine').scrollTop())*/


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



  //状态标记
  $(document.body).infinite().on("infinite", function() {
    if(loading) return;
    loading = true;
    $('.weui-infinite-scroll').show();
    if (a == 0) {
      p.one +=1;
      getNewPack(p.one,10,oF);
    }
    if (a==1) {
      p.two+=1;
      getAdvPack(p.two,10,'pId=&cId=&subId=');
    }
    if (a==2) {
      p.three+=1;
      getMyOrder(p.three,10);
    }
  });
})();

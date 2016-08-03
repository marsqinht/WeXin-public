;(function(){
    var $region = $('.city-select');
    var $province = $('.province');
    var $city = $('.city');
    var $sub = $('.district');
    var $picker = $('.city-picker-dropdown');
    var $searchRegion = $('.pack-search');
    var textPro = '';
    var textCity = '';
    var textSub = '';
    var regionIndex = 0;
    var j = {
      BeginProvince:0,
      BeginCity:0,
      BeginCounty:0,
      EndProvince:0,
      EndCity:0,
      EndCounty:0
    };
    var $beginDate = $('#txtBeginDate');
    var $endDate = $('#txtEndDate');
    var $beginAddr = $('input[name="PackageBeginAddress"]');
    var $endAddr = $('input[name="PackageEndAddress"]');
    var $carCount = $('input[name="PackageCount"]');
    var $goodPrice = $('input[name="PackageGoodsPrice"]');
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
        j.BeginCity = oId;
      };
      if (regionIndex == 1) {
        j.EndCity = oId;
      };
      $searchRegion.eq(regionIndex).text(textPro);
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
        j.BeginProvince = oId;
      };
      if (regionIndex == 1) {
        j.EndProvince = oId;
      };
      $searchRegion.eq(regionIndex).text(textPro+'/'+textCity);
    });

    //点击地区
    $sub.on('click','a',function(){
      var oId = $(this).attr('data-id');
      textSub = $(this).html();
      $picker.hide();
      if (regionIndex==0) {
        j.BeginCounty = oId;
      };
      if (regionIndex == 1) {
        j.EndCounty = oId;
      };
      $searchRegion.eq(regionIndex).text(textPro+'/'+textCity+'/'+textSub);
    });

    //点击 出发/目的地
    $searchRegion.on('click',function(){
      var _index = $('.pack-search').index($(this));
      console.log(_index)
      if (_index == 0) {
        regionIndex = 0;
        $picker.css('top','325px');
      };
      if (_index==1) {
        regionIndex = 1;
        $picker.css('top','388px');
      };
      $picker.show();
    })

    //询价
    $('.pack-orange').on('click',function(){
      if (j.BeginProvince==0) {
        alert('请输入出发地区!');
        return;
      };
      if (!$beginAddr.val()) {
        alert('请输入出发详细地址!');
        return;
      };
      if (j.EndProvince==0) {
        alert('请输入目的地区!');
        return;
      };
      if (!$endAddr.val()) {
        alert('请输入目的地详细地址!');
        return;
      };
      if (!$beginDate.val()) {
        alert('请输入出发日期!');
        return;
      };
      if (!$endDate.val()) {
        alert('请输入结束日期!');
        return;
      };
      if (!$goodPrice.val()) {
        alert('请输入货物单价!');
        return;
      };
      if (!$carCount.val()) {
        alert('请输入需求车数!');
        return;
      };

      console.log(j);
      var startForm = $('#start-form').serialize();
      var coalForm = $('#coal-form').serialize();
      var offerForm = $('#pack-offers').serialize();
      var ticketForm = $('#pack-ticket').serialize();
      var carForm = $('#car-info-form').serialize();
      var memoForm = $('#memo-form').serialize();
      var param = toParam(j)+'&'+startForm+'&'+coalForm+'&'+offerForm+'&'+ticketForm+'&'+carForm+'&'+memoForm;
      console.log(param)
      submitOrder(param)

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

     getCategory();
    //获取煤炭种类
    function getCategory() {
      var str = '';
      $.get('/api/RoadIndexApi/GetSCategoryList', function(data) {
        if (data && data.IsSuccess) {
          console.log(data)
          var aList = data.Data;
          for (var i = 0, len = aList.length; i < len; i++) {
            str += '<p class="coal fl">'+
          '<input type="radio" name="PackageGoodsCategoryId" id="male" value="'+aList[i].Id+'" /><label for="male">'+aList[i].CategoryName+'</label>'+
          '</p>';
          }
          //console.log(str);
         $('#pack-coal-select').html(str);
        }

      })
    }

    //提交发包单
    function submitOrder(param){
      $.post('/api/CTCTC/TempEnquiryApi/AddEnquiryPackage',param,function(data){
        if (data && data.IsSuccess) {
          alert(data.Message || '询价成功')
        }else{
          alert(data.Message || '询价失败');
        }
      })
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
   $('.pack-time').date_input();

   var turnOff = true;
   var $phone = $('#pack-phone-num');
   var oVal = '';
   //获取验证码
   $('.verify-btn').on('click',function(){
     oVal = $phone.val();
     if (!/^1\d{10}$/.test(oVal)) {
       alert('请输入正确的手机号码!');
       return;
     };
     if (!turnOff)return;
     turnOff = false;
     getMessage(oVal);
   });

   //询价
   $('.pack-code-btn').on('click',function(){
     console.log(1);
     var oMsg = $('#pack-msg').val();
     j.ContactTel = oVal;
     verifyMessage(oVal,oMsg);
   })


   function getMessage(num){
     $.get('/api/CTCTC/TempEnquiryApi/SendshortMessage?phoneNum=' + num,function(data){
       console.log(data)
       if (data && data.IsSuccess) {
         var $verify = $('.verify-btn');
         $verify.addClass('verify-btn-gray');
         var n = 60;
         $verify.text(n+'秒后重新发送');
         var timer = setInterval(function(){
           n--;
           $verify.text(n+'秒后重新发送');
           if (n==0) {
             $verify.removeClass('verify-btn-gray').text('获取验证码');
             clearInterval(timer);
             turnOff = true;
           };
         },1000)
       }else{
         turnOff = true;
       }
     });
   }

   function verifyMessage(num,msg){
     $.get('/api/CTCTC/TempEnquiryApi/VerifyThisMessage?phoneNum='+num+'&shortMsg='+msg,function(data){
       console.log(data)
       if (data && data.IsSuccess) {
          $('.pack-mask').addClass('mask-hide');
          $('.pack-acount-wrap').hide();
       }else{

         alert(data.Message||'验证失败!')
       }

     });
   }
})();
/*; (function () {
    var oId ='';
    //上传营业执照
    document.querySelector('#business-file').addEventListener('change', function () {
        $.showLoading();
        lrz(this.files[0])
          .then(function (rst) {
              // 处理成功会执行
              console.log(rst);
              var fileName = rst.origin.name;
              var picBase64 = rst.base64;
              var parm = {
                TenantId: oId,
                FileName: fileName,
                Content: picBase64
              };
              upload(parm,0,picBase64);
          })
          .catch(function (err) {
              // 处理失败会执行
          })
          .always(function () {
              // 不管是成功失败，都会执行
          });
    });

    //上传信息部门头照
    document.querySelector('#depart-file').addEventListener('change', function () {
        $.showLoading();
        lrz(this.files[0])
          .then(function (rst) {
              // 处理成功会执行
              console.log(rst);

              var fileName = rst.origin.name;
              var picBase64 = rst.base64;
              var parm = {
                TenantId: oId,
                FileName: fileName,
                Content: picBase64
              };
              upload(parm,1,picBase64);
          })
          .catch(function (err) {
              // 处理失败会执行
          })
          .always(function () {
              // 不管是成功失败，都会执行
          });
    });
    //获取某个cookie值
    function GetCookieValue(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
     var cookies = document.cookie.split(';');
     for (var i = 0; i < cookies.length; i++) {
       var cookie = $.trim(cookies[i]);
       if (cookie.substring(0, name.length + 1) == (name + '=')) {
     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
     break;
       }
     }
      }
      return cookieValue;
    }

    //删除指定cookie
    function DelCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
      var cval = GetCookieValue(name);
      document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
    }
    //上传图片
    function upload(parm,num,img){
      console.log(11);
      $.post('/api/InfoDepartApi/UpLoadFile',parm,function (data) {
           console.log(data)
            if (data && data.IsSuccess) {
              $.hideLoading();
              $.toast('图片添加成功');
              $('.reg-upload-input-wrap').eq(num).css('backgroundImage','url('+img+')')
            }else{
              var oData = JSON.parse(data);
              $.hideLoading();
              $.toast(oData.Message ||'添加失败', "forbidden");
            }
        })
    }
})();
*/
; (function () {
    var $cellInput = $('input[name="TenantTel"]');//手机号验证
    var $tips = $('.cell-tips');
    var wUser = toJson(location.search.substring(1)).wUserId;
    var tel = toJson(location.search.substring(1)).tel;
    var turnOff = true;
    //提交未验证的验证表单
    $('.not-btn').on('tap', function () {
        var oF = decodeURI($('#register-form').serialize()) + '&ExtendField=' + wUser;
        if (!testTel($cellInput.val())) {
          $tips.show();
          setTimeout(function(){
             $tips.hide();
          },1500);
          return;
        };
        if (!turnOff) return;
        turnOff = false;
        console.log(oF);
        $.post('/api/InfoDepartApi/AddDepartment', toJson(oF), function (data) {
            console.log(data);
            if (data && data.IsSuccess) {
              turnOff = true;
              var oHref = getCookie('YQ_REDIRECT_URL').split('=')[1];
              $.toast('添加成功!',function(){
                location.href= oHref;
              });
            }else{
              var oData = JSON.parse(data);
              $.toast(oData.Message,'forbidden');
              turnOff = true;
            }
        });
    });
    getUserByTel(wUser,tel);
    //通过电话获取用户信息
    function getUserByTel(id,tel){
      $.get('/api/InfoDepartApi/GetUserIncludeDelByTel?wUserId='+id+'&tel='+tel,function(data){
         console.log(data);
         var oData = data.SingleData;
         if (oData) {
          if (oData.IsDeleted) {
            $('.warning-tips').html('<div class="warning-tips_text">您的经纪人管理人员账号已更替，如有疑问请与客服联系。<br/><br/>客服电话：<a href="tel:4006751756">400-675-1756</a></div>')
          }
         }else {
          $('.warning-tips').html('<div class="warning-tips_text">您的经纪人信息不完整，请联系客服人员，补充相关信息!<br/><br/>客服电话：<a href="tel:4006751756">400-675-1756</a></div>');
      }
      });
    }

    function testTel(str){
      return /^1[34578]\d{9}$/.test(str);
    }
    //获取cookie值
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }

    //参数转成json
    function toJson(str){
      var oJson = {};
      var arr = str.split('&');
      for (var i = 0; i < arr.length; i++) {
        var single = arr[i].split('=');
        oJson[single[0]]=single[1];
      }
      return oJson;
    }
})();
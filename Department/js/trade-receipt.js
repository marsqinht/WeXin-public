;(function(){
	var packageId = location.search;
	//获取包详情
	function getPackDetail(){
		$.get('/api/InfoDepartApi/GetVPackge'+packageId,function(data){
			console.log(data);
			if (data && data.IsSuccess) {
				var single = data.SingleData;
				var html = template('tpl-receipt',data);
				$('.bills-wrap').html(html);
			};
		})
	}
})();

;(function(){
	  var param = location.search.substring(1);
    var pStatus = toJson(param).status;
		var $sendBtn = $('.bills-btn_send');//矿发保存按钮
		var $getBtn = $('.bills-btn_get');//签收保存按钮
		var $pic = $('.bills-pic');
		var $num = $('.bills-num');
		var pJson = {};//参数

		pJson.TicketId = toJson(param).Id;
    if (pStatus=='8' ||pStatus=='9'||pStatus=='10'||pStatus=='11' ) {
      $('#ticket_over').hide();
      $('.open-popup').removeClass().attr('data-target','');
    };
		//上传矿发吨数
    document.querySelector('#bills-send-file').addEventListener('change', function () {
        $.showLoading();
        lrz(this.files[0])
          .then(function (rst) {
              // 处理成功会执行
              console.log(rst);
              $.hideLoading();
              pJson.SendFileName = rst.origin.name;
              pJson.SendFileContent = rst.base64;
              var $dateInput = $('.date-input').eq(0);
              pJson.InitTime = $dateInput.val();
              $('.bills-date_get').eq(0).html($dateInput.val());
              $pic.eq(0).css(' backgroundImage','url('+pJson.SendFileContent+')').show();
              $.toast('图片上传成功',function(){
                closePop()
              });

          })
          .catch(function (err) {
              // 处理失败会执行
          })
          .always(function () {
              // 不管是成功失败，都会执行
          });
    });

    //上传签收吨数
    document.querySelector('#bills-get-file').addEventListener('change', function () {
        $.showLoading();
        lrz(this.files[0])
          .then(function (rst) {
              // 处理成功会执行
              console.log(rst);
              $.hideLoading();
              pJson.ReachFileName = rst.origin.name;
              pJson.ReachFileContent = rst.base64;
              var $dateInput = $('.date-input').eq(1);
              pJson.ReachTime = $dateInput.val();
              $('.bills-date_get').eq(1).html($dateInput.val());
              $pic.eq(1).css(' backgroundImage','url('+pJson.ReachFileContent+')').show();
              $.toast('图片上传成功',function(){
                closePop()
              });

          })
          .catch(function (err) {
              // 处理失败会执行
          })
          .always(function () {
              // 不管是成功失败，都会执行
          });
    });

    //矿发
    $sendBtn.on('touchend',function(e){
      var $dateInput = $('.date-input').eq(0);
      pJson.InitTime = $dateInput.val();
      $('.bills-date_get').eq(0).html($dateInput.val());
    	$pic.eq(0).css(' backgroundImage','url('+pJson.SendFileContent+')').show();
    	closePop();
      e.preventDefault();
      return false;
    })
    //签收
    $getBtn.on('touchend',function(e){
      var $dateInput = $('.date-input').eq(1);
      pJson.ReachTime = $dateInput.val();
      $('.bills-date_get').eq(1).html($dateInput.val());
    	$pic.eq(1).css(' backgroundImage','url('+pJson.ReachFileContent+')').show();
    	closePop();
      e.preventDefault();
      return false;
    })

    $('#send-bills-input').on('blur',function(){
    	pJson.InitWeight = $(this).val();
    	$num.eq(0).text(pJson.InitWeight);
    })
    $('#get-bills-input').on('blur',function(){
    	pJson.ReachWeight = $(this).val();
    	$num.eq(1).text(pJson.ReachWeight);
    });

    $('.bills-btn_confirm').on('tap',function(){
      console.log(pJson);
      if (!pJson.InitTime) {
        $.toast('请输入矿发时间!','forbidden');
        return;
      };
      if (!pJson.ReachTime) {
        $.toast('请输入签收时间!','forbidden');
        return;
      };
      goCar(pJson);
    });

    //取消
    $('.bills-btn_cancel').on('tap',function(){
      $.prompt("请说明取消原因", function(text) {
      cancelTicket(pJson.TicketId,text)
      console.log(text);
      }, function() {
      //点击取消后的回调函数
      });
    })
    function goCar(pJson){
      $.showLoading('正在上传中');
    	$.post('/api/InfoDepartApi/ExecuteTicket',pJson,function(data){
				console.log(data);
				if (data && data.IsSuccess) {
          $.hideLoading();
					$.toast('上传成功',function(){
            window.location.href = document.referrer;
          })
				}else{
					var oData = JSON.parse(data);
          $.hideLoading();
					$.toast(oData.Message||"上传失败", "forbidden");
				}
			})
    }
    function getVticket(tId){
      $.get('/api/InfoDepartApi/GetVTicketInfoDepartById?ticketId='+tId,function(data){
        console.log(data);
        if (data && data.IsSuccess) {
          var single = data.SingleData;
          var html = template('tpl-receipt',data);
          var $dateInput = $('.bills-date_get');
          $('.bills-wrap').html(html);
          if (single.LoadTime) {
            $dateInput.eq(0).html(single.LoadTime.split('T')[0]);
            $('.date-input').eq(0).val(single.LoadTime.split('T')[0]);
          };
          if (single.SignTime) {
            $dateInput.eq(1).html(single.SignTime.split('T')[0]);
            $('.date-input').eq(1).val(single.SignTime.split('T')[0]);
          };
          $('.bills-num').eq(0).text(single.TicketWeightInit);
          pJson.InitWeight = single.TicketWeightInit;
          pJson.ReachWeight = single.TicketWeightReach;
          $('#send-bills-input').val(single.TicketWeightInit);
          $('#get-bills-input').val(single.TicketWeightReach);
          var inPath = single.InitPath.replace(/\\/g, '/');
          var endPath = single.ReachPath.replace(/\\/g, '/');
          $pic.eq(0).css(' backgroundImage','url('+inPath+')').show();
          $('.bills-num').eq(1).text(single.TicketWeightReach);
          $pic.eq(1).css(' backgroundImage','url('+endPath+')').show();
          if (single.CustomOperation == 1) {
            $('#ticket_over').removeClass('flx-space').find('.weui_btn_warn').show();
            $('.bills-btn_cancel,.bills-btn_confirm').hide();
          };
        }else{
          var oData = JSON.parse(data.SingleData);
          $.alert(oData.Message);
        }
      })
    }
    getVticket(pJson.TicketId);

    function cancelTicket(tId,content){
      $.showLoading('正在提交中');
      $.get('/api/InfoDepartApi/CancleArrangeVehicle?ticketId='+tId+'&content='+content,function(data){
        console.log(data);
        if (data && data.IsSuccess) {
          $.hideLoading();
          $.toast(data.Message || '已经提交申请，请等待工作人员与您联系',function(){
            window.location.reload();
          });
        }else{
          $.hideLoading();
          var oData = JSON.parse(data);
          $.alert(oData.Message || '取消失败');
        }
      })
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
})();
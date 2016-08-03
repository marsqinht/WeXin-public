$(function () {
    (function () {
        //渲染车辆数据
        $.getJSON('/api/MobileApi/GetTopContacts?openid=' + openid + '&packageId=' + packageId, function (data) {
            var contactData = data.Data;
            var carHtml = '';
            if (data.IsSuccess) {
                for (var i = 0; i < contactData.length; i++) {
                    var _vehicleNo = contactData[i].VehicleNo;
                    var _id = contactData[i].Id;
                    var _tel = contactData[i].Tel;
                    carHtml +='<li class="car-src" data='+_id+'><div>'+_vehicleNo+'</div><div>'+_tel+'</div><div class="car-select"></div></li>'
                };
                $('.car-list').append(carHtml);
            };
            
        })
        //我报名的车辆
        $.getJSON('/api/MobileApi/GetAppliedVehicleInGroup?openid=' + openid + '&packageId=' + packageId, function (data) {
            var listOther = '';
            if (data.IsSuccess) {
                var listApplied = '';
                if (!data.SingleData.AgreedCount && !data.SingleData.RefusedCount && !data.SingleData.UntreatedCount) {
                    $('.my-applied-car').hide();
                    return
                }
                if (data.SingleData.AgreedCount) {
                    for (var i = 0; i < data.SingleData.AgreedData.length; i++) {
                        for (var j = 0; j < data.SingleData.AgreedData[i].length; j++) {
                            listApplied += '<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary"><p>' + data.SingleData.AgreedData[i][j].ApplyVehicleNo + '<span class="applied-c">已报名</span></p>' +
                                '</div><div class="weui_cell_ft">' + data.SingleData.AgreedData[i][j].ApplyTel + '</div></div>';
                        }
                    }
                }
                if (data.SingleData.RefusedCount) {
                    for (var i = 0; i < data.SingleData.RefusedData.length; i++) {
                        for (var j = 0; j < data.SingleData.RefusedData[i].length; j++) {
                            listApplied += '<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary"><p>' + data.SingleData.RefusedData[i][j].ApplyVehicleNo + '<span class="refuse">已拒绝</span></p>' +
                                '</div><div class="weui_cell_ft">' + data.SingleData.RefusedData[i][j].ApplyTel + '</div></div>';

                        }

                    }
                }
                if (data.SingleData.UntreatedData) {
                    for (var i = 0; i < data.SingleData.UntreatedData.length; i++) {
                        for (var j = 0; j < data.SingleData.UntreatedData[i].length; j++) {
                            listApplied += '<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary"><p>' + data.SingleData.UntreatedData[i][j].ApplyVehicleNo + '<span class="untreat">未处理</span></p>' +
                               '</div><div class="weui_cell_ft">' + data.SingleData.UntreatedData[i][j].ApplyTel + '</div></div>';
                        }
                    }
                }
                $('.applied-car-content').html(listApplied);
            }
        });
        //我要报名-->车辆报名
        $('.car-register').on('touchstart','.car-src', function () {
            var $thisIcon = $(this).find('.car-select');
            if ($thisIcon.hasClass('selected')) {
                $thisIcon.removeClass('selected');
            } else {
                $thisIcon.addClass('selected');
            }

        })
        //我要报名-->添加车辆
        $('.car-add').on('touchstart', function () {
            $('#mask').addClass('me-mask-active');
            $('.car-sheets').addClass('to-bottom').show();
            //$('.add-phone').show();
            $('.car-sheets').find('input').on('focus', function () {
                $('.car-sheets').removeClass('to-bottom').addClass('to-top');
            })
            
        })
        //我要报名-->添加车辆-->点击确定
        $('.add-car-btn').on('touchstart',function(){          
            var _addr = $(this).parent().find('input[name="vehicleNo"]');
            var _phone = $(this).parent().find('input[name="tel"]');
            var _driver = $(this).parent().find('input[name="driverName"]');
            var f = $('#add-vehicle-form');
            console.log(tel, name)
            if (!/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(_addr.val())) {
                alertTxt('请输入正确的车牌号!')
                return;
            }
            
            if (!_phone.val()) {
                _phone.val(tel);
            }
            if (!_driver.val()) {
                _driver.val(name)
            }
            if (!/^1\d{10}$/i.test(_phone.val())) {
                alertTxt('请输入正确的手机号码!');
                return;
            }
            $('#mask').removeClass('me-mask-active');
            $('.car-sheets').removeClass('to-top').hide();
		    $.ajax({
		        type: 'GET',
		        url: '/api/MobileApi/AddVehicle?' + f.serialize(),
		        dataType: 'json',
		        timeout: 30000,
		        success: function (data) {
                    if (data && data.IsSuccess) {
                        $('.car-list').append('<li class="car-src" data='+data.SingleData.Id+'>' +
                      '<div>' + _addr.val() + '</div>' +
                      '<div>' + _phone.val() + '</div>' +
                      '<div class="car-select selected"></div>');
                        toastTxt('添加车辆成功');
		            }
		            else {
                        toastTxt(data.Message || "添加车辆失败",'error');
		            }

		        },
		        error: function (xhr, type) {
		            toastTxt("添加车辆失败", 'error');
		        }
		    })
            return false;
        })
        //选中提交报名
        var isSub = false;
        $('.car-confirm').on('touchstart', function () {
            console.log(isSub)
            if(isSub){
                toastTxt('请勿重复报名','error');
                return
            }
            isSub = true;
            var $carConfirm = $('.car-register').find('.selected').parent();
            var $chooseCheck = $('.car-src').find('.car-select');
            var idArr = [];
            var hasChoose = false;
            $chooseCheck.each(function (i, elem) {
                if ($(elem).hasClass('selected')) {
                    hasChoose = true;
                    idArr.push($(elem).parent().attr('data'))
                }             
            })
            if (hasChoose) {//已选中车辆
                    $.ajax({
                        type:'GET',
                        url:'/api/MobileApi/ApplyAlready?openId='+openid+'&packageId='+packageId+'&topContactsIds='+idArr.join('-'),
                        success: function (data) {
                            isSub = false;
                            toastTxt(data.Message);
                            location.reload();
                        },
                        error: function (data) {
                            isSub = false;
                            toastTxt('报名失败','error')
                        }
                    })
            }
            else {//没有选择任何车辆
                isSub = false;
                toastTxt('未选择车辆','error');
            }

        })
   
        //用户第一次报名,输入手机验证码
        var totalCountdown = 60;
        if (!tel) {
            $('#mask').addClass('me-mask-active');
            $('.ac-sheets').show().on('touchstart', 'input', function () {
                $('.add-phone').removeClass('to-bottom').addClass('to-top');
            });
            $('#msg-confirm-btn').on('touchstart', function () {
                if (currCountdown < totalCountdown) {
                    return;
                }
                var $sendTel = $('.weui_cell_primary input[name="tel"]').val();
                
                if (!/^1\d{10}$/i.test($sendTel)) {
                    toastTxt("请输入正确的手机号码", 'error');
                }
                else {
                    //倒计时
                    ShortMsgCountdown($("#msg-confirm-btn"));
                    $.getJSON('/api/MobileApi/GetChangeTelMsg?userId=' + userId + '&tel=' + $sendTel, function (data) {
                        console.log(data)
                        if (data && data.IsSuccess) {
                            toastTxt(data.Message);
                        }
                        else {
                            toastTxt(data.Message || "获取验证码失败", 'error');
                        }
                    });
                }
            });
            //验证 点击确定
            $('.msg-verfiy').on('touchstart', function () {
                
                if (!/^\d{4}$/i.test($('.code').val())) {
                    toastTxt('请输入正确的短信验证码', 'error');
                    return;
                } else {
                    var f2 = $('.Tel_form');
                    console.log(f2.serialize())
                    $.ajax({
                        type: 'GET',
                        url: '/api/MobileApi/ChangeTel?' + f2.serialize(),
                        dataType: 'json',
                        timeout: 30000,
                        success: function (data) {
                            if (data && data.IsSuccess) {
                                toastTxt("添加电话成功");
                                $('.ac-sheets').removeClass('to-top').hide();
                                 $('#mask').removeClass('me-mask-active');
                            }
                            else {
                                toastTxt(data.Message || "修改电话失败", 'error');
                            }
                        },
                        error: function (xhr, type) {
                            toastTxt("修改电话失败", 'error');
                        }
                    })
                    //$.getJSON('/api/MobileApi/ChangeTel?userId=' + userId + '&tel=' + $('.weui_cell_primary input[name="tel"]').val() + '&shortMsg='+ $('.code').val(), function (data) {
                    //    if (data && data.IsSuccess) {
                    //        toastTxt(data.Message);
                    //        $('.add-phone').removeClass('to-top').hide();
                    //        $('#mask').removeClass('me-mask-active');
                    //    }
                    //    else {
                    //        console.log(data.Message)
                    //        toastTxt(data.Message, 'error');
                    //    }
                    //});
                }
                
                return false;
            })
        }

        var currCountdown = totalCountdown;
        function ShortMsgCountdown($btn) {
            if (currCountdown <= 0) {
                $btn.text("点击获取");
                $btn.removeClass("num-loop")
                currCountdown = totalCountdown;
            } else {
                $btn.addClass("num-loop")
                $btn.text("重新获取(" + currCountdown + ")");
                currCountdown--;
                setTimeout(function () {
                    ShortMsgCountdown($btn)
                }, 1000)
            }
        }
    })();

})
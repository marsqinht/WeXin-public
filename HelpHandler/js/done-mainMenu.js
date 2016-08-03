//报名人数

$(function () {
    $.getJSON('/api/MobileApi/GetAppliedCount?packageId=' + packageId, function (data) {
        
        if (data.IsSuccess ) {

            var applyHtml = '';
     
                applyHtml = applyHtml
                + '报名<span>                                                                 '
                + '         ' + data.SingleData + '                    '
                + ' <span>                                                                  '
                + '';
                
                $(".people-num").append(applyHtml);
        }
    });
    
})

$(function () {
    //取消发包弹窗

    //取消发包按钮绑定事件
    $('.cancel-fabu').on('touchstart', function () {
        $('#dialog1').show().find('.c-publish-wrap').show();
        $('#dialog1').find('.c-apply-wrap').hide();
    });
    //取消发包弹窗确定绑定事件
    $('.c-comfirm').on('touchstart', function () {
        var f = $('.Pacmanage_from');
        $.ajax({
            type: 'GET',
            url: '/api/MobileApi/CanclePubPackage?' + f.serialize(),
            dataType: 'json',
            timeout: 30000,
            success: function (data) {
                if (data && data.IsSuccess) {
                    //userInfo.$menu.eq(index).find('.weui_cell_ft').html(modiInfo);
                    $('#dialog1').hide();
                    toastTxt("已取消发包");
                    $('.cancel-fabu').css({ background: '#999' }).off('touchstart').html('已取消发包');

                }
                else {
                    toastTxt(data.Message || "未能取消发包");
                }

            },
            error: function (xhr, type) {
                toastTxt("未能取消发包");
            }
        })
    });
    //取消发包弹窗取消绑定事件
    $('.c-cancel').on('touchstart', function () {
        $('#dialog1').hide();
    });

    //停止报名取消
    $('#dialog1').find('.applied-c-cancel').on('touchstart', function () {
        $('#dialog1').hide();
        $('.stop-apply').addClass('cancel-apply')
    })
    //停止报名点击保定
    var isStopApplied = true;
    $('.stop-btn').on('touchstart', function () {
        if (!isStopApplied) return;
        if (!$(this).find('.stop-apply').hasClass('cancel-apply')) {//未勾选
            console.log(1)
        } else {//勾选
            $('#dialog1').show().find('.c-apply-wrap').show();
            $('#dialog1').find('.c-publish-wrap').hide();
            //确定停止报名
            $('#dialog1').find('.applied-c-confirm').on('touchstart', function () {
                $.ajax({
                    type: 'GET',
                    url: '/api/MobileApi/StopRegist?packageId=' + packageId,
                    dataType: 'json',
                    timeout: 30000,
                    success: function (data) {
                        if (data && data.IsSuccess) {
                            $('#dialog1').hide();
                            //userInfo.$menu.eq(index).find('.weui_cell_ft').html(modiInfo);
                            alertTxt("已停止报名");
                            isStopApplied = false;
                        }
                        else {
                            alertTxt(data.Message || "停止报名失败");
                        }

                    },
                    error: function (xhr, type) {
                        alertTxt("停止报名失败");
                    }
                })
            })
        }
        if (pakcagestatus == 'IsOver' || pakcagestatus == 'IsCancle') { } else {
            $(this).find('.stop-apply').toggleClass('cancel-apply');
        }
    });

    //报名管理-->车辆选择
    (function () {
        //点击全选
        $('.all-select').on('touchstart', function () {
            $(this).toggleClass('all-ok');
            if ($(this).hasClass('all-ok')) {
                $(this).parent().siblings().addClass('ok');
            } else {
                $(this).parent().siblings().removeClass('ok');
            }
        });
        //车辆选择
        $('.details-num').on('touchstart', function () {
            var turnOff = true;
            $(this).toggleClass('ok');
            $(this).parent().find('.details-num').each(function (i, elem) {
                if (!$(elem).hasClass('ok')) {
                    turnOff = false;
                };
                if (turnOff == false) {
                    $(this).parent().find('.all-select').removeClass('all-ok');
                } else {
                    $(this).parent().find('.all-select').addClass('all-ok');
                }
            })
        })

        //选择
        $('.list-item-car').on('touchstart', function () {
            $(this).parent().next('.item-details').toggle();
        })
        //确定
        $('.car-confirm').on('touchstart', function () {
            $(this).parents('.item-details').hide();
        })

        if (pakcagestatus == 'IsOver' || pakcagestatus == 'IsCancle') {
            $('.cancel-fabu').css({ background: '#999' }).off('touchstart').html('已取消发包');
            $('.stop-btn').find('.stop-apply').removeClass('cancel-apply');
        } else {
            $('.stop-btn').find('.stop-apply').addClass('cancel-apply');
        }
    })();

});



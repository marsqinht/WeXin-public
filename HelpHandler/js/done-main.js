    //报名人数
$(function () {
    $.getJSON('/api/MobileApi/GetAppliedAgreedCount?packageId=' + packageId, function (data) {
        if (data.IsSuccess) {
            var applyAgreeHtml = '';          
            applyAgreeHtml = applyAgreeHtml
                + '         ' + data.SingleData + '                    '
                + '';
            $(".agreed-count").append(applyAgreeHtml);
        }
    });

    $.getJSON('/api/MobileApi/GetAppliedCount?packageId=' + packageId, function (data) {
        if (data.IsSuccess) {
            var applyHtml1 = '';
            applyHtml1 = applyHtml1
                + '         ' + data.SingleData + '                    '
                + '';
            $(".total-count").append(applyHtml1);
            }
    });

    $.getJSON('/api/MobileApi/GetAllVAppliedVehicleInGroup?packageId=' + packageId, function (data) {
        if (data.IsSuccess) {
            for (var dataL = 0; dataL < data.SingleData.length; dataL++) {
                var listHtml = '';
                var listDetails = ''
                for (var dataj = 0; dataj < data.SingleData[dataL].length; dataj++) {
                    if (data.SingleData[dataL][dataj].ApplyStatus == 1) {
                        listDetails += '<li class="details-num ok" data=' + data.SingleData[dataL][dataj].Id + '>' + data.SingleData[dataL][dataj].ApplyVehicleNo + '</li>'
                    } else {
                        listDetails += '<li class="can-choose details-num" data=' + data.SingleData[dataL][dataj].Id + '>' + data.SingleData[dataL][dataj].ApplyVehicleNo + '</li>'
                    }      
                };
                listHtml += ' <li class="list-item"><div class="list-item-name"> ' + data.SingleData[dataL][0].UserName + '</div>' +
                            ' <a href="tel:' + data.SingleData[dataL][0].UserTel + '">' + data.SingleData[dataL][0].UserTel + '<div class="item-tel-icon"></div></a>' +
                            ' <div class="list-item-car"><span>' + data.SingleData[dataL].length + '</span>车<div class="more-button"></div></div></li>'+
                            '<ul class="item-details" style="display:none"><li class="details-feture"><span class="all-select">全选</span><span class="car-confirm">确定</span></li>' + listDetails + '</ul>'
                $(".list-content").append(listHtml);
            }
            //    listHtml = listHtml
            //    + '  <li class="list-item"> '
            //    + ' <div class="list-item-name"> ' + data.SingleData[dataL][0].UserName + '</div>                                                                 '
            //    + '     <a href="tel:13089878990">' + data.SingleData[dataL][0].UserTel + '<div class="item-tel-icon"></div></a>                       '
            //    + '         <div class="list-item-car"><span>' + data.SingleData[dataL].length + '</span>车<div class="more-button"></div></div></li>'
            //    + '         <ul class="item-details" style="display:none"> '
            //     + '         <li class="details-feture">    <span class="all-select">全选</span><span class="car-confirm">确定</span></li>'
                
            //    for (var dataj = 0; dataj < data.SingleData[dataL].length; dataj++)
            //    {
            //        listHtml = listHtml


            //    + '             <li class="details-num" data=' +  data.SingleData[dataL][dataj].Id + '>' + data.SingleData[dataL][dataj].ApplyVehicleNo + '</li>       '

            //    }
            //    + '         </ul>                                                         '
            //        }
            //$(".list-content").append(listHtml);
            }
    });

            })

$(function () {

    //报名管理-->车辆选择
    (function () {
        //刷新页面
        $('.list-info-reload').on('touchstart', function () {
            window.location.reload();

        });
        //点击全选
        $('.all-select').live('touchstart', function () {
            $(this).toggleClass('all-ok');
            if ($(this).hasClass('all-ok')) {
                $(this).parent().siblings().addClass('ok');
            } else {
                $(this).parent().siblings().removeClass('ok');
            }
        });
        //车辆选择
        $('.can-choose').live('touchstart', function () {
            var allOK = false;
            $(this).toggleClass('ok');
            $(this).parent().find('.details-num').each(function (i, elem) {
                if (!$(elem).hasClass('ok')) {
                    allOK = true;
                };
                if (allOK) {
                    $(this).parent().find('.all-select').removeClass('all-ok');
                } else {
                    $(this).parent().find('.all-select').addClass('all-ok');
                }
            })
        })

        //选择
        
        $('.list-item-car').live('touchstart', function () {
            $(this).parent().next('.item-details').toggle();
        })
        //确定
        $('.car-confirm').live('touchstart', function () {
            $(this).parents('.item-details').hide();

            var $ul = $(this).parent().parent().find('li.details-num.ok');

            
            var ids = [];
            $ul.each(function (i, v) {
                ids[ids.length] =$(v).attr('data')
            });
            if (ids.length) {
                $.getJSON('/api/MobileApi/AgreeApply?userId=' + userId + '&packageId=' + packageId + '&applyIds=' + ids.join('-'), function (data) {
                    
                    if (data && data.IsSuccess) {
                        toastTxt(data.Message || '同意报名成功');
                        location.reload();
                    }
                    else {
                        toastTxt(data.Message || '同意报名失败','error');
                    }
                });
            }
            else {
                toastTxt("请选择要同意的名单",'error');
            }
        })
    })();

});



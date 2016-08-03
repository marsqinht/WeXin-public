$(function () {
    (function () {
        //我要报名-->车辆报名
        $('.car-register').find('.car-src').on('touchstart', function () {
            var $thisIcon = $(this).find('.car-select');
            if ($thisIcon.hasClass('selected')) {
                $thisIcon.removeClass('selected');
            } else {
                $thisIcon.addClass('selected');
            }

        })
        //取消报名
        $('.car-cancel').on('touchstart', function () {

        })
        //确定报名
        $('.car-confirm').on('touchstart', function () {
            var carConfirm = $('.car-register').find('.selected').parent();
        })
    })();
    (function () {

    });

    //无限加载
    var p = 1;
    if (p == "") p = 1;
    var stop = true;//触发开关，防止多次调用事件  
    $(window).scroll(function () {
        //当内容滚动到底部时加载新的内容 100当距离最底部100个像素时开始加载.  
        if ($(this).scrollTop() + $(window).height() + 100 >= $(document).height() && $(this).scrollTop() > 100) {

            if (stop == true) {
                stop = false;
                p = p + 1;//当前要加载的页码  
                $.getJSON('/api/MobileApi/EnterOwnPackageList?userId=' + userId + '&pageIndex=' + p + '&pageSize=10', function (data) {
                    if (data && data.IsSuccess && data.Data && data.Data.length > 0) {
                        
                        var listHtml = ''
                        for (var dataL = 0; dataL < data.Data.length; dataL++) {
                            var companyTitle = data.Data[dataL].PakcageTenant ? data.Data[dataL].PakcageTenant : nickName;
                            listHtml = listHtml
                            + '  <a href="/Mobile/Detail?packageId=' + data.Data[dataL].Id + '&openid=' + openid + '">  '
                            + ' <section class="order-item">                                                                  '
                            + '     <div class="left-logo"><img src="' + data.Data[dataL].Headimgur + '"></div>                        '
                            + '         <div class="right-content">'
                            + '         <div class="company-name"> ' + companyTitle + ' <div class="order-prcie "><span>' + data.Data[dataL].PackagePrice + '</span>元/吨</div>   </div>               '
                            + '         <div class="order-people "><span>' + data.Data[dataL].ApplyCount + '</span> 报名</div> '
                            + '         <div class="addr-start">' + data.Data[dataL].PackageBeginAddress + '</div>                                                                '
                            + '             <div class="addr-end">' + data.Data[dataL].PackageEndAddress + ' <div class="order-cancel">' + data.Data[dataL].WPackageStatus + ' </div> </div> '
                            + '<div class="time-people"><div class="linkman">联系人：<span>' + data.Data[dataL].TdscTel + '</span></div>'
                            + '             <div class="order-time fr">' + data.Data[dataL].CreateTime.substring(0,10) + '</div>       '
                            + '             </div>        '
                            + '         </div>                                                          '
                            + ' </section>     </a>                                                              '
                            + '';
                        }

                        $(".order-container").append(listHtml);
                    }
                });
            }
        }
    });

    $.getJSON('/api/MobileApi/EnterOwnPackageList?userId=' + userId + '&pageIndex=' + 1 + '&pageSize=10', function (data) {
        if (data && data.IsSuccess && data.Data && data.Data.length > 0) {
            var listHtml = ''
            for (var dataL = 0; dataL < data.Data.length; dataL++) {
                var companyTitle = data.Data[dataL].PakcageTenant ? data.Data[dataL].PakcageTenant : nickName;
                listHtml = listHtml
                + '  <a href="/Mobile/Detail?packageId=' + data.Data[dataL].Id + '&openid=' + openid + '">  '
                + ' <section class="order-item">                                                                  '
                + '     <div class="left-logo"><img src="' + data.Data[dataL].Headimgur + '"></div>                        '
                + '         <div class="right-content">'
                + '         <div class="company-name"> ' + companyTitle + ' <div class="order-prcie "><span>' + data.Data[dataL].PackagePrice + '</span>元/吨</div>   </div>               '
                           + '         <div class="order-people "><span>' + data.Data[dataL].ApplyCount + '</span> 报名</div> '
                + '         <div class="addr-start">' + data.Data[dataL].PackageBeginAddress + '</div>                                                                '
                           + '             <div class="addr-end">' + data.Data[dataL].PackageEndAddress + ' <div class="order-cancel">' + data.Data[dataL].WPackageStatus + ' </div> </div> '
                           + '<div class="time-people"><div class="linkman">联系人：<span>' + data.Data[dataL].TdscTel + '</span></div>'
                           + '             <div class="order-time fr">' + data.Data[dataL].CreateTime.substring(0, 10) + '</div>       '
                + '             </div>        '
                + '         </div>                                                          '
                + ' </section>     </a>                                                              '
                + '';
            }

            $(".order-container").append(listHtml);
        }
    });
})
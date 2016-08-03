;(function(){
    var packageDetails = {},
        me = packageDetails;
    //订单状态判断
    me.getStatus = function(status){
        if (status == 'IsNormal') {
            $('.fabu-done-content').show();
        }else{
             $('.order-wrap-c').show();
             $('.order-manage').show();
             $('.me-apply').hide();
        }
        var orderStatus = status=='IsOver'?'订单已完成':'订单已取消';
            $('.have-done').html(orderStatus);
    }
    //分享到朋友圈
    me.shareFriends = function(){  
        var $oMask = $('#mask'),
            $oTips = $('#share-tips-img');  
        if (/Publish?/.test(sessionStorage.linkHref)){
            me.toggleMask($oMask,$oTips);
        }         
        $('.details-share-btn').on('touchstart', function () {
            me.toggleMask($oMask,$oTips);
        })
        $oMask.on('touchstart', function () {
            me.toggleMask($oMask,$oTips);
            if (sessionStorage.linkHref)sessionStorage.removeItem('linkHref')
            return false;
        })
    }
    
    //分享提示遮罩
    me.toggleMask = function(mask,tip){
        mask.toggleClass('me-mask-active');
        tip.toggle();
    }

    //截止日期去除小时\分钟
    me.changeTime = function(time){
        return $('.pg-end-time').html(time)
    }
    //获取数据
    me.getData = function(){
        //已报名人数
        $.getJSON('/api/MobileApi/GetAppliedCount?packageId=' + packageId, function (data) {
            if (data.IsSuccess) {
                $(".people-num,.applied-num").find('span').html(data.SingleData);
            }
        });

        //已报名的车牌号信息
        $.getJSON('/api/MobileApi/GetAllVAppliedVehicleInGroup?packageId=' + packageId, function (data) {
            var appliedData = data.SingleData;
            var carHtml = '';
            if (appliedData.length == 0) {
                $('.applied-num').hide();
                return
            }
            if (data.IsSuccess) {
                for (var i = 0; i < appliedData.length; i++) {
                    var _single = appliedData[i];
                    for (var j = 0; j < _single.length; j++) {
                        var status = _single[j].ApplyStatus == 1 ? '已同意' : '未处理';
                        var carNum = _single[j].ApplyVehicleNo.replace(_single[j].ApplyVehicleNo.substring(3, 5), '**');
                        carHtml += '<div class="applied-item"><p>' + carNum + '</p><p>' + status + '</p></div>'
                    }
                }
                $('.applied-list').append(carHtml);
            }
        });

        //该用户的其它订单
        $.getJSON('/api/MobileApi/GetListOwnOther?userId=' + userId + '&pageIndex=0&pageSize=20&packageId='+packageId, function (data) {
            var listOther = '';
            if (data.IsSuccess) {
                if (data.Data.length == 0) {
                    $('.other-order').hide();
                    return;
                }
                if (data.Data.length == 1)$('.other-order-content').height('1rem');
                if (data.Data.length == 2)$('.other-order-content').height('2rem');
                for (var i = 0; i < data.Data.length; i++) {
                    listOther += '<a class="weui_cell" href="/Mobile/Detail?packageId=' + data.Data[i].PackageId + '&openid=' + openid + '" >' +
                        '<div class="weui_cell_bd">'+
                            '<p class="limit-w"><span>'+data.Data[i].PackageBeginAddress+'</span><span>—></span><span>'+data.Data[i].PackageEndAddress+'</span></p>'+
                        '</div><div class="weui_cell_bd">'+data.Data[i].PackageEndTime.substring(5,10)+'</div>'+
                        '<div class="weui_cell_ft"><span>'+data.Data[i].PackagePrice+'</span>元/吨</div></a>';
                };
                $('.other-order').find('.weui_cells_access').html(listOther);
            }
        });

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
    }

    me.getStatus(wpStatus);
    me.shareFriends();
    me.changeTime(pgEndtime);
    me.getData();
    
})();




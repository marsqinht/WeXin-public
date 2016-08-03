$(function () {
    var placeHolder='';
    var $pubInfo = $('.pub-info');
    var $addrBtn = $('.addr-confirm-btn');
    var $addInp = $('.get-inputs');
    var $otherInput = $('.other-inputs');
    var oMask = $('.menu-mask');
    var sendGoods = 1;
    var inputTurnoff = true;
    //本地储存用户发包信息
    if (localStorage.appliedTel) {
        $('input[name=TdscTel]').val(localStorage.appliedTel);
    }
    var $eachForm = $('.value-change');
    if (sessionStorage.formRecord) {
        var jsonForm = JSON.parse(sessionStorage.formRecord)
        $eachForm.each(function (index,elem) {
            $(elem).val(jsonForm[index])
        })
    }
    window.onunload = function () {
        var formValue = {};
        $eachForm.each(function (index, elem) {
            formValue[index] = $(elem).val();
        });
        sessionStorage.formRecord = JSON.stringify(formValue);
    }
    //点击发包 input
    $pubInfo.on('touchstart',function(){
        placeHolder = $(this).attr('placeholder');
        oval = $(this).val();
        $otherInput.attr('placeholder',placeHolder).val(oval).show().focus();
        $addrBtn.show();
        $pubInfo.removeClass('checked');
        $(this).addClass('checked')
        inputTurnoff = true; 
        oMask.addClass('weui_mask');
        if ($(this).hasClass('type-num')) {
            $otherInput.attr('type','number')
        }else{
             $otherInput.attr('type','text')
        } 
        return false;
    })
    $otherInput.on('blur',function(){
        var inpVal = $(this).val(); 
        oMask.removeClass('weui_mask');
        $addrBtn.hide();
        $pubInfo.each(function(i,elem){
            if($(elem).hasClass('checked')){
                if (!$otherInput.val())return;
                $(elem).val($otherInput.val())
            }
        });
        $(this).hide().val('');
    })
    //点击发货
    $('.fa-addr').on('touchstart', function () {
        sendGoods = 1;
        placeHolder = $(this).find('input').attr('placeholder');
        oMask.addClass('weui_mask');
        $('.addr-sheets').addClass('weui_actionsheet_toggle');
        return false;
    })

    $('.add-address').on('touchstart', function () {
        inputTurnoff = false;
        $addrBtn.show();
        $('.get-inputs').attr('placeholder',placeHolder).show().focus();
        return false;
    })
   
    //点击收货
    $('.shou-addr').on('touchstart', function () {
        sendGoods = 0;
        placeHolder = $(this).find('input').attr('placeholder');
        oMask.addClass('weui_mask');
        $('.addr-sheets').addClass('weui_actionsheet_toggle');
       // return false;
    })
    //点击其他区域，菜单消失
    $('.menu-mask,.addr-confirm-btn').on('touchstart', function () {
       
        if (inputTurnoff) {
            $otherInput.blur();
            $pubInfo.each(function(i,elem){
                if($(elem).hasClass('checked')){
                    if (!$otherInput.val())return;
                    $(elem).val($otherInput.val())
                }
            })
            $otherInput.attr('placeholder','').val('').hide();
        }else{//地址修改
            $addInp.blur();
        }       
        $addrBtn.hide();
        $addInp.hide();
        $otherInput.hide();
        sheetsHide();
        return false;
    })


    //发/收货地址输入框输入完成后
    $addInp.on('blur', function () {
        var _index = $(this).attr('placeholder');
        var addVal = $(this).val();
        if (_index == '请输入发货地址') {//发货
            $('.begin-addr').val(addVal);
        } else {//收货
            $('.end-addr').val(addVal);
        }  
        $addrBtn.hide();
        $(this).val('').hide();
        oMask.removeClass('weui_mask');
        $.ajax({
            type: 'GET',
            url: '/api/MobileApi/AddAddr?city=&addrdetail=' + addVal + '&userid=' + userId,
            dataType: 'json',
            timeout: 30000,
            success: function (data) {
                if (data && data.IsSuccess) {
                    $('.get-menu').append('<div class="weui_actionsheet_cell">' + addVal + '</div>')
                    $('.send-menu').append('<div class="weui_actionsheet_cell">' + addVal + '</div>')
                }
                else {
                    alertTxt(data.Message || "添加地址失败");
                }

            },
            error: function (xhr, type) {
                alertTxt("添加地址失败");
            }
        })

        $('.get-inputs').hide();
    })

    //选择地址
    $('.weui_actionsheet_cell').live('touchstart', function (e) {
        var target = $(e.target);
        if (sendGoods) {
            $('.fa-addr').find('input').val(target.html());
        } else{
            $('.shou-addr').find('input').val(target.html());
        };
        sheetsHide();
        return false;
    })
    //点击发布事件绑定
    var isSubmiting = false;
    $('.fabu-btn').on('touchstart', function () {
        console.log()
        if (isSubmiting) {
            toastTxt('请勿频繁提交','error')
            return;
        }

        var f = $('.publish-form');
        var cDate = new Date().getTime();
        var endTime = new Date($('.deadline').val().split('-').join('/')).getTime();      
        var msg = '';
        if(endTime<=cDate){
            toastTxt('请输入正确的截止日期','error');
            return;
        }
        if (!$('input[name=PackageBeginAddress]').val()) { toastTxt('请输入发货地址！','error'); }
        else if (!$('input[name=PackageEndAddress]').val()) { toastTxt('请输入收货地址！', 'error'); }
        else if (!($('input[name=PackagePrice]').val())) { toastTxt('请输入运费（元/吨）！', 'error'); }
        else if (!($('input[name=PackageCount]').val())) { toastTxt('请输入总车数！', 'error'); }
        else {
            var paraShortMsg = ''
            var $shortMsg = $("input[name=shortMsg]");
            if ($shortMsg && $shortMsg.length > 0) {
                if (!/^\d{4}$/i.test($shortMsg.val())) {
                    toastTxt('请输入正确的短信验证码', 'error');
                    return;
                }
            } else {// 拼接一个空字符串，接口里面有这个字段
                paraShortMsg = '&shortMsg=';
            }
            isSubmiting = true;
            localStorage.appliedTel = $('input[name=TdscTel]').val();
            $.getJSON('/api/MobileApi/PublishPackage?' + f.serialize() + paraShortMsg, function (data) {
                setTimeout(function () {
                    isSubmiting = false;
                }, 4000)
                if (data && data.IsSuccess) {
                    sessionStorage.linkHref = location.href;
                    toastTxt(data.Message || "发包成功");
                    location.href = '/Mobile/Detail?packageId=' + data.SingleData.Id;
                }
                else {
                    toastTxt(data.Message || "发包失败", 'error');
                }
            });
        }
    })

    var totalCountdown = 60; // 短线验证码停止发送手机
    $('#short-msg-btn').on('touchstart', function () {
        if (currCountdown < totalCountdown) {
            return;
        }
        if (!/^1\d{10}$/i.test($('input[name=TdscTel]').val())) {
            toastTxt("请输入正确的手机号码", 'error');
            return;
        }
        else {
            //倒计时
            $.getJSON('/api/MobileApi/GetPublishPackageMsg?openid=' + openid + '&tel=' + $('input[name=TdscTel]').val(), function (data) {
                if (data && data.IsSuccess) {
                    ShortMsgCountdown($("#short-msg-btn"));
                    toastTxt(data.Message);
                }
                else {
   
                    toastTxt(data.Message || "获取验证码失败",'error');
                }
            });
        }
    })
    var currCountdown = totalCountdown;
    function ShortMsgCountdown($btn) {
        if (currCountdown <= 0) {
            $btn.text("点击获取");
            $btn.removeClass("disabled")
            currCountdown = totalCountdown;
        } else {
            $btn.addClass("disabled")
            $btn.text("重新获取(" + currCountdown + ")");
            currCountdown--;
            setTimeout(function () {
                ShortMsgCountdown($btn)
            }, 1000)
        }
    }
    //截止日期初始化
    $('.deadline').val(dateFormat().dateF)

    //信息表格消失函数
    function sheetsHide() {
        oMask.removeClass('weui_mask');
        $('.weui_actionsheet').removeClass('weui_actionsheet_toggle');
    }
    //储存表单数据
    function savaData(){
        sessionStorage.v = 2;
    }
});


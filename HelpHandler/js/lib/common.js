$(function () {
    //输入法遮挡问题
    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
    $('.close-btn-wrap').on('touchstart', function () {
        $(this).parent().hide();
        return false;
    })
    //导航激活状态
    function navActive() {
        if ($('link.nav-order').length != 0) {
            $('.bottom-nav').find('.weui_tabbar_item').eq(0).addClass('weui_bar_item_on');
        }
        if ($('link.nav-publish').length != 0) {
            $('.bottom-nav').find('.weui_tabbar_item').eq(1).addClass('weui_bar_item_on');
        }
        if ($('link.nav-hot').length != 0) {
            $('.bottom-nav').find('.weui_tabbar_item').eq(2).addClass('weui_bar_item_on');
        }
        if ($('link.nav-me').length != 0) {
            $('.bottom-nav').find('.weui_tabbar_item').eq(3).addClass('weui_bar_item_on');
        }
    }
    navActive();

    //底部导航栏
    var bottomNav = {
        render: function () {
            var $bottomBtn = $('.bottom-nav').find('.weui_tabbar_item');
            $bottomBtn.on('touchstart', function () {
                var _index = $bottomBtn.index($(this));
                $bottomBtn.removeClass('weui_bar_item_on');
                $(this).addClass('weui_bar_item_on');
                if (_index == 0) {

                };
            })
        }
    }
    bottomNav.render();

    //底部导航栏-->我的订单-->报名/发布历史
    $('.bottom-nav').find('a').eq(0).on('touchstart', function () {
        $('.select-list').toggle();
    });
    $('.select-item').on('touchstart', function () {
        $(this).css('color', '#09bb07')
    })

})
//获取当前时间
function dateFormat() {
    var curDate = new Date();
    var oDate = new Date((curDate / 1000 + 86400*2) * 1000)
    oY = oDate.getFullYear(),
    oM = oDate.getMonth() + 1,
    oD = oDate.getDate();
    return {
        dateF: toTwo(oY) + '-' + toTwo(oM) + '-' + toTwo(oD)
    }
};

function toTwo(n) {
    n = n > 9 ? n : '0' + n;
    return n
}

//信息弹窗方法
function alertTxt(str) {
    $('body').append('<div class="weui_dialog_alert" id="dialog2" style="display:none"><div class="weui_mask"></div><div class="weui_dialog"><div class="weui_dialog_hd"></div><div class="weui_dialog_bd">' + str + '</div><div class="weui_dialog_ft"><a href="javascript:;" class="weui_btn_dialog primary">确定</a></div></div></div>')
    $('#dialog2').show();
    $('.weui_dialog_ft').on('touchstart', function () {
        $('#dialog2').hide().remove();
        return false;
    })
}

//toast 弹窗方法
function toastTxt(content, type, num) {
    var num = num ? num : 1000;
    var rORe = type ? 'weui_icon_warn' : 'weui_icon_toast';
    if ($('#a-toast')) $('#a-toast').remove();
    $('body').append('<div id="a-toast" style="display: block;"><div class="mask-transparent"></div><div class="toast" id="target-toast"><i class="' + rORe + '"></i><p class="toast-content">' + content + '</p></div></div>')
    var toastWidth = $('#target-toast').width();
    var mLeft = document.documentElement.clientWidth;
    $('#target-toast').css({
        "marginLeft": (mLeft - toastWidth) / 2
    });
    setTimeout(function () {
        $('#a-toast').remove();
    }, num)
}

/*;(function($){

    function _tel(val){
        return /^1\d{10}$/i.test(val);
    };

    function _email(val){
        return  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val)
    };
    function _carNum(val){
        return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(val); 
    }
    $.testTel = function(val){
        return /^1\d{10}$/i.test(val);
    }
})(window.Zepto);
*/
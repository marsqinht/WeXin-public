(function () {
    var width = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = 100 * (width / 750) + 'px';
    console.log(width);
    if (width > 1000) {
        document.documentElement.style.fontSize = '50px';
        $('.p-content').css('width', '50%');
    };
})()

$(function () {
    //标签点击出现列表
    var $oTag = $('.pub-info').find('.tag'),
	    $oList = $('.tag-list');

    //监测用户是否在APP中打开
    //if(navigator.userAgent != /* app的ua信息 */ )return;
    $oTag.on('touchstart', function () {
        var tagColor = $(this).css('color');
        $oList.hide();
        $(this).find('ul').css('background', tagColor).show();
        return false;
    })

    //点击其他部分列表消失
    $(document).on('touchstart', function () {
        $oList.hide();
    })

    //标签下列表点击事件
    var $tagList = $oList.find('li');
    $tagList.on('touchstart', function () {
        var _index = $tagList.index($(this));
        if (_index % 2 == 1) {
            //取消关注的事件


            $oList.hide();
            return false;
        };
    })
})
//�����С����Ӧ
(function (doc, win) {
    var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 50 * (clientWidth / 720) + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

//���ê��λ�� 
function goToTag(tag) {
    var oTarget = $('.' + tag + '');
    $(window).scrollTop(oTarget.eq(0).offset().top);
}
//字体大小自适应
(function (doc, win) {    
            var docEl = doc.documentElement,    
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',    
            recalc = function () {    
            var clientWidth = docEl.clientWidth;    
            if (!clientWidth) return;    
            docEl.style.fontSize = 30* (clientWidth / 720) + 'px';  
        };    
        if (!doc.addEventListener) return;    
        win.addEventListener(resizeEvt, recalc, false);    
        doc.addEventListener('DOMContentLoaded', recalc, false);    
})(document, window);

(function(){
    //跳转对应锚点
   /* console.log(document.referrer)
   $(window).bind('touchstart',function(){
        $(window).scrollTop($('#peichang').offset().top);
   }) 
*/
})();
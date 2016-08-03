var oLogin = {
    nameInp: getElementsByClassName('user-name')[0],//用户名输入框
    pwdInp: getElementsByClassName('user-pwd')[0],//密码输入框
    validateInp: getElementsByClassName('verify')[0],//验证码输入框
    nameTips : getElementsByClassName('name-error')[0],//用户名为空提示
    pwdTips: getElementsByClassName('pwd-error')[0],//密码错误提示
    validateTips: getElementsByClassName('error validate-error')[0],//密码错误提示
    isCheck:document.getElementById('check-rem'),
	qrcode:function(){//二维码出现/隐藏
        var oMask    = document.getElementById('mask'),
            oQRcode  = getElementsByClassName('qr-show',oMask)[0],
            codeWrap = getElementsByClassName('QR-code')[0];
        oQRcode.onmouseover = function(){
            codeWrap.style.display = 'block';
        }
        oQRcode.onmouseout = function(){
            codeWrap.style.display = 'none';
        }
    },
    userJudge:function(){//登录按钮点击事件
        if(!this.nameInp.value) {//用户名为空
            this.nameTips.style.display = 'block';
        };
        if (0/*用户密码判断成立条件*/) {//正确

        } else{//错误
            this.pwdTips.style.display = 'block';
        };
        
        if (this.isCheck.checked) {//点击保持登录
            
        };

    },
    focus:function(){//输入框获取焦点
        this.nameInp.onfocus = function(){
            oLogin.nameTips.style.display = 'none';
        }
        this.pwdInp.onfocus = function(){
            oLogin.pwdTips.style.display = 'none';
        }
        this.validateInp.onfocus = function () {
            oLogin.validateTips.style.display = 'none';
        }
    }
}
oLogin.qrcode();//二维码出现
oLogin.focus();//输入框获取焦点


//byClassName 兼容函数;
function getElementsByClassName(className,root,tagName) { //root：父节点，tagName：该节点的标签名。
    if(root){
        root=typeof root=="string" ? document.getElementById(root) : root;   
    }else{
        root=document.body;
    }
    tagName=tagName||"*";                                    
    if (document.getElementsByClassName) { //如果浏览器支持getElementsByClassName，就直接的用
        return root.getElementsByClassName(className);
    }else { 
        var tag= root.getElementsByTagName(tagName);//获取指定元素
        var tagAll = [];//用于存储符合条件的元素
        for (var i = 0; i < tag.length; i++) {//遍历获得的元素
            for(var j=0,n=tag[i].className.split(' ');j<n.length;j++){//遍历此元素中所有class的值，如果包含指定的类名，就赋值给tagnameAll
                if(n[j]==className){
                    tagAll.push(tag[i]);
                    break;
                }
            }
        }
        return tagAll;
    }
}
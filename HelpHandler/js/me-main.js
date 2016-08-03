//“我”-->更改用户信息界面
/*var userInfo = {
	elems:{//获取元素
		$company:$('#user-company-modi'),//公司
		$tel:$('#user-tel-modi'),//电话
		$mask: $('#mask'),//遮罩
		$companyForm:$('.Company-form').find('.add-company'),//修改公司表单
		$telForm:$('.Tel_form').find('.add-phone'),//写该电话表单
		$sheets:$('.ac-sheets'),//俩表单
		$getCode:$('.Tel_form').find('.get-code'),//获取验证码按钮
		$telBtn:$('#change-tel-btn'),
	},
	turnOff:true,
	timer:null,
	toggleForm:function(obj){//表单出现
		var el = this.elems;
		el.$mask.toggleClass('me-mask-active');
		obj.removeClass('to-top').addClass('to-bottom').toggle();
	},
	formClick:function(){//修改公司/电话
		var me = this,
			el = me.elems;
		el.$company.on('touchstart',function(){
			me.toggleForm(el.$companyForm);
		});
		el.$tel.on('touchstart',function(){
			me.toggleForm(el.$telForm)
		});
		
	},
	hideMask:function(){//遮罩与表单消失
		var el = this.elems;	
		el.$mask.toggleClass('me-mask-active');
		el.$sheets.removeClass('to-top').hide();
	},
	formFocus:function(obj){
		obj.removeClass('to-bottom').addClass('to-top');
	},
	getVal:function(el){
		return el.val();	
	},
	getTelMsg:function(userid,tel){//验证手机号码
		 $.ajax({
            type: 'GET',
            url: '/api/MobileApi/GetChangeTelMsg?userId=' + userid + '&tel=' + tel,
            dataType: 'json',
            timeout: 30000,
            success: function (data) {
                if (data && data.IsSuccess) {                 
                    toastTxt("获取验证码成功");
                }
                else {
                    toastTxt(data.Message || "获取验证码失败",'error');
                }
            },
            error: function (xhr, type) {
                alertTxt("获取验证码失败");
            }
        })
	},
	sendTelData:function(){//修改电话
		var me = this;
		var el = this.elems;
		var param = $('.Tel_form').serialize();
	    $.ajax({
	        type: 'GET',
	        url: '/api/MobileApi/ChangeTel?' + param,
	        dataType: 'json',
	        timeout: 30000,
	        success: function (data) {
	            if (data && data.IsSuccess) {
	                el.$tel.find('.weui_cell_ft').html($('input[name=tel]').val());
	                me.hideMask();
	                toastTxt("修改电话成功");	               
	            }
	            else {
	                toastTxt(data.Message || "修改电话失败",'error');
	            }
	        },
	        error: function (xhr, type) {
	            toastTxt("修改电话失败",'error');
	        }
	    })  
	},
	sendComData:function(){
		var me = this;
		var el = me.elems;
		var f = $('.Company-form');
		var $companyInput = $('.modi-company');
		if (!$companyInput.val()) {
			toastTxt('请输入公司名称','error');
			return;
		};
	    $.ajax({
	        type: 'GET',
	        url: '/api/MobileApi/ChangeTenant?' + f.serialize(),
	        dataType: 'json',
	        timeout: 30000,
	        success: function (data) {
	            if (data && data.IsSuccess) {
	               el.$company.find('.weui_cell_ft').html($companyInput.val())
	                toastTxt("公司修改成功");
	                me.hideMask();
	            }
	            else {
	                toastTxt(data.Message || "公司修改失败");
	            }
	            
	        },
	        error: function (xhr, type) {
	            alertTxt("公司修改失败");
	        }
	    })
	},
	countDown:function(obj){//验证码倒计时
		var num = 60,
			me = this;
			me.turnOff = false;
		obj.addClass('code-toggle').text('60秒后重发');
		me.timer = setInterval(function(){
			num--;
			obj.text(''+num+'秒后重发');		
			if (num==0) {
				clearInterval(me.timer);
				me.turnOff = true;
				obj.removeClass('code-toggle').text('获取验证码');
			};
		},1000)
	},
	init:function(){
		var me = this,
		    el = me.elems;
		this.formClick();
		//点击遮罩;
		el.$mask.on('touchstart',function(){
			me.hideMask();
			return false;
		});

		//表单点击防止键盘遮挡
		el.$sheets.on('touchstart',function(){
			me.formFocus($(this))
		});

		//获取验证码
		el.$getCode.on('touchstart',function(){
			if (!me.turnOff)return;
			var telVal = me.getVal(el.$telForm.find('input[name="tel"]'));
			var userid =me.getVal($('.Tel_form').find('input[name=userId]'));
			if (!/^1\d{10}$/i.test(telVal)) {
				alertTxt('请输入正确的手机号码');
			}else{
				me.countDown($(this));
				me.getTelMsg(userid,telVal);
			}
		});
		//修改手机号确定按钮
		el.$telBtn.on('touchstart',function(){
			me.sendTelData();
			return false;
		});
		el.$companyForm.find('.weui_btn').on('touchstart',function(){
			me.sendComData();
			return false;
		})

	}
}
userInfo.init();*/

var userInfo = {
	$menu : $('.user-info').find('.user-list'),
	infoModle: function(obj,index,fn){
		var $oCompany = obj;
		var num = 60;
		var timer = null;
		var codeOnoff = true;
		$('#mask').addClass('me-mask-active');
		$oCompany.show().addClass('to-bottom');
		var $modiCompany = $oCompany.find('.weui_input');
		$modiCompany.on('focus',function(){//点击公司，修改
			$oCompany.removeClass('to-bottom').addClass('to-top');
		})
		var coConfirm = $oCompany.find('.weui_btn_area');
		$('.get-code').on('touchstart', function () {
		    if (codeOnoff) {
		        codeOnoff = false;
		        var userid = $('.Tel_form input[name=userId]').val();
		        var tel = $('.Tel_form input[name=tel]').val();
		        var _this = $('.get-code');
		        if (!/^1\d{10}$/i.test(tel)) {
		            codeOnoff = true;
		            toastTxt("请输入正确的手机号", 'error');
                    return
		        }
		        _this.addClass('code-toggle').html('' + num + '秒后重发');
		        timer = setInterval(function () {
		            num -= 1;
		            _this.html('' + num + '秒后重发');
		            if (num == 0) {//验证超时
		                clearInterval(timer);
		                _this.removeClass('code-toggle').html('获取验证码');
		                num = 60;
		                codeOnoff = true;
		            };
		        }, 1000);
		        $.ajax({
		            type: 'GET',
		            url: '/api/MobileApi/GetChangeTelMsg?userId=' + userid + '&tel=' + tel,
		            dataType: 'json',
		            timeout: 30000,
		            success: function (data) {
		                if (data && data.IsSuccess) {
		                    
		                    toastTxt("获取验证码成功");
		                }
		                else {
		                    toastTxt(data.Message || "获取验证码失败",'error');
		                }
		            },
		            error: function (xhr, type) {
		                alertTxt("获取验证码失败");
		            }
		        })
		    }
		})
		coConfirm.on('touchstart',function(e){
			var modiInfo = $modiCompany.attr('value');
			$('#mask').removeClass('me-mask-active');
			$oCompany.removeClass('to-top').hide();
			if (modiInfo){
				if (index== 0) {//确定修改公司
				    var f = $('.Company-form');
				    $.ajax({
				        type: 'GET',
				        url: '/api/MobileApi/ChangeTenant?' + f.serialize(),
				        dataType: 'json',
				        timeout: 30000,
				        success: function (data) {
				            if (data && data.IsSuccess) {
				                userInfo.$menu.eq(index).find('.weui_cell_ft').html(modiInfo);
				                toastTxt("公司修改成功");
				            }
				            else {
				                toastTxt(data.Message || "公司修改失败");
				            }
				            
				        },
				        error: function (xhr, type) {
				            alertTxt("公司修改失败");
				        }
				    })
				};
				if (index== 1) {//确定修改电话
				    var f2 = $('.Tel_form');
				    console.log(f2.serialize())
				    codeOnoff = true;
				    num = 60;	    
				    $.ajax({
				        type: 'GET',
				        url: '/api/MobileApi/ChangeTel?' + f2.serialize(),
				        dataType: 'json',
				        timeout: 30000,
				        success: function (data) {
				            if (data && data.IsSuccess) {
				                userInfo.$menu.eq(index).find('.weui_cell_ft').html(modiInfo);
				                toastTxt("修改电话成功");
				            }
				            else {
				                toastTxt(data.Message || "修改电话失败",'error');
				            }

				        },
				        error: function (xhr, type) {
				            toastTxt("修改电话失败",'error');
				        }
				    })
				};
			}else{
				alertTxt('请输入信息');
			}

			$('.get-code').removeClass('code-toggle').html('获取验证码');
			clearInterval(timer);
			e.preventDefault();
		});
	}
	,
	bind: function () {
		userInfo.$menu.on('touchstart',function(){
			var  _index = userInfo.$menu.index($(this));
			switch(_index){
				case 0://添加公司
				userInfo.infoModle($('.add-company'),0);
				break;
				case 1://添加电话
				userInfo.infoModle($('.add-phone'),1);
				break;
			}
		})
	}
}
//添加车辆、地址模块
var addCar = {
	bind:function(){
		var $addCar = $('.add-car .add-btn');
		var $addList = $('.car-sheets');
		var $oInput = $('.sheets-list').find('input');
		//添加出车辆/地址按钮
		$addCar.on('touchstart',function(){
			$('#mask').addClass('me-mask-active');
			$addList.addClass('to-bottom').show();
				$oInput.on('focus',function(){
					$addList.removeClass('to-bottom').addClass('to-top');
				})
		})

	    //点击阴影弹窗消失
		$('#mask').on('touchstart', function () {
		    $(this).removeClass('me-mask-active');
		    $addList.removeClass('to-top').hide();
		    $('.ac-sheets').removeClass('to-top').hide();
		    return false;
		})
		//点击确定添加车辆/地址
		$addList.find('.weui_btn_area').on('touchstart',function(){
			$('#mask').removeClass('me-mask-active');
			$addList.removeClass('to-top').hide();
			if ($(this).attr('class') == 'weui_btn_area car-btn') {//添加车辆
			    var f = $('#add-vehicle-form');
			    var oTel = $('.add-phone').find('input[name="tel"]');
			    var oDriver = $('.add-name').find('input[name="driverName"]');
                console.log(oTel.val())
			    if(!oTel.val()){
			        oTel.val(tel)
			    }
			    if(!oDriver.val()){
			        oDriver.val(name)
			    }
			    if (!/^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test($oInput.eq(0).attr('value'))) {
			        alertTxt('请输入正确的车牌号!')
			        return
			    }
			    if (!/^1\d{10}$/i.test($oInput.eq(1).attr('value'))) {
			        alertTxt('请输入正确的电话号码！');
			        return
			    }
			    $.ajax({
			        type: 'GET',
			        url: '/api/MobileApi/AddVehicle?' + f.serialize(),
			        dataType: 'json',
			        timeout: 30000,
			        success: function (data) {
			            if (data && data.IsSuccess) {
			                $('.car-info').append('<div class="car-items"><div class="car-num">' + $oInput.eq(0).attr('value') + '</div><div class="car-phone">' + $oInput.eq(1).attr('value') + '</div><div class="car-del">删除<span>&nbsp&nbsp</span><input type="hidden" value="' + data.SingleData.Id+ '" name="id"/></div></div>')
			                alertTxt("添加车辆成功");
			            }
			            else {
			                alertTxt(data.Message || "添加车辆失败");
			            }

			        },
			        error: function (xhr, type) {
			            alertTxt("添加车辆失败");
			        }
			    })
				
			}else{//添加地址
			    var f2 = $('#add-addr-form');
			    $.ajax({
			        type: 'GET',
			        url: '/api/MobileApi/AddAddr?' + f2.serialize(),
			        dataType: 'json',
			        timeout: 30000,
			        success: function (data) {
			            if (data && data.IsSuccess) {
			                $('.car-info').append('<div class="car-items"><div class="car-num">' + $oInput.eq(0).attr('value') + $oInput.eq(1).attr('value') + '</div><div class="car-del">删除<span>&nbsp&nbsp</span><input type="hidden" value="' + data.SingleData.Id + '" name="id"/></div></div>')
			                toastTxt("添加地址成功");
			                location.reload();
			            }
			            else {
			                alertTxt(data.Message || "添加地址失败");
			            }

			        },
			        error: function (xhr, type) {
			            alertTxt("添加地址失败");
			        }
			    })
				
			}
			return false;
		})
		//删除车辆
		var $cDel = $('.car-del');
		$cDel.live('touchstart', function () {
		    var _this = $(this);

		    if (!_this.hasClass('addr-del')) {  // 删除车辆
		        var id = _this.find('input[name=id]').val();
		        if (id) {
		            $.ajax({
		                type: 'GET',
		                url: '/api/MobileApi/RemoveVehicle?topContactsId=' + id,
		                dataType: 'json',
		                timeout: 30000,
		                success: function (data) {
		                    if (data && data.IsSuccess) {
		                        toastTxt(data.Message || "删除地址成功");
		                        _this.parent().remove();
		                    }
		                    else {
		                        alertTxt(data.Message || "删除车辆失败");
		                    }

		                },
		                error: function (xhr, type) {
		                    alertTxt("删除车辆失败");
		                }
		            })
		        }
		        else {
		            alertTxt("删除车辆失败");
		        }
		    }
		    else { // 删除地址
		        var id2 = _this.find('input[name=id]').val();
		        if (id2) {
		            $.ajax({
		                type: 'GET',
		                url: '/api/MobileApi/RemoveAddr?topAddressId=' + id2,
		                dataType: 'json',
		                timeout: 30000,
		                success: function (data) {
		                    if (data && data.IsSuccess) {
		                        toastTxt(data.Message || "删除地址成功");
		                        _this.parent().remove();
		                    }
		                    else {
		                        alertTxt(data.Message || "删除地址失败");
		                    }

		                },
		                error: function (xhr, type) {
		                    alertTxt("删除地址失败");
		                }
		            })
		        }
		        else {
		            alertTxt("删除地址失败");
		        }
		    }

		})
	}
}
userInfo.bind();
addCar.bind();
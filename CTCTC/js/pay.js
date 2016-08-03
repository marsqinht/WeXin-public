; (function () {
    var paramJson = toJson(location.search.substring(1));//参数
    var user = paramJson.CTCTCUserId;//获取uerid
    if (paramJson.packageCode == "" || paramJson.packageCode == null) {
        alert("参数pacakgeCode没有获取到，请重新获取");
    };

    //地址栏的packagecode
    getPayList(paramJson.packageCode);

    //同意付款
    $('.pay-agree').on('click', function () {
        var val = $('#tickets-settle_form').serialize().split('=')[1];
        if (val) {
            var ticketsId = val.split('-')[0];
            var pay = val.split('-')[1];
            settleTickets(ticketsId, pay, user);
        } else {
            alert("请选择数据");
        }
    })

    //驳回
    $('.pay-reject').on('click', function () {
        var ticketsId = $('#tickets-settle_form').serialize().split('=')[1];
        if (ticketsId) {
            var memo = $('.pay-memo').val();
            if (memo == "") {
                alert("请填写驳回理由");
            }
            cancleTicket(ticketsId, user, memo);
        }
        else {
            alert("请选择数据");
        }
    })

    //获取待结算的运单
    function getPayList(id) {
        $.get('/api/CTCTC/TrackApi/GetTicketList?packageCode=' + id, function (data) {
            if (data && data.IsSuccess) {
                var str = '';
                var oData = data.Data;
                for (var i = 0; i < oData.length; i++) {
                    str += '<tr>' +
								'<td><label><input name="ticket" type="radio" value="' + oData[i].TicketId + '-' + oData[i].PackageSettlementType + '" /> </label> </td>' +
								'<td>' + oData[i].TicketCode + '</td>' +
								'<td>' + oData[i].VehicleNo + '</td>' +
								'<td>' + oData[i].TicketWeightInit + '</td>' +
								'<td>' + oData[i].TicketWeightReach + '</td>' +
								'<td>' + oData[i].TicketWeightReachTime.split('T').join(' ') + '</td>' +
								'<td>' + oData[i].TicketStatus + '</td>' +
								'<td><a href="PayDetail?ticketId=' + oData[i].TicketId + '" class="list-operate">查看</a></td>' +
							'</tr>';
                };
                $('#pay-index-tbody').html(str);
            };
        })
    }

    //结算运单
    function settleTickets(ticketsId, pay, userId) {
        $.get('/api/CTCTC/TrackApi/TicketsSettle?tickets=' + ticketsId + '&platformPay=' + pay + '&CTCTCUserId' + userId, function (data) {
            if (data && data.IsSuccess) {
                alert(data.Message)
            };
        })
    }

    //申请取消运单
    function cancleTicket(ticketsId, userId, memo) {
        $.get('/api/CTCTC/TrackApi/TicketsSettle?ticketId=' + ticketsId + '&CTCTCUserId' + userId + '&memo=' + memo, function (data) {
            if (data && data.IsSuccess) {
                alert(data.Message)
            };
        })
    }

    //参数json化
    function toJson(str) {
        var arr = str.split('&');
        var oP = {};
        for (var i = 0; i < arr.length; i++) {
            var key = arr[i].split('=')[0];
            var value = arr[i].split('=')[1];
            oP[key] = value;
        };
        return oP;
    }
})();
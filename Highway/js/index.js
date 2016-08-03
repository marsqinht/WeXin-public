(function () {
    var $aProList = $('.srch-start'); //出发地wrap
    var $startPro = $aProList.find('.srch-start_pro'); //省份
    var $searchWrap = $('.search-wrap'); //搜索区域
    var $form = $('#search-form'); //搜索表单
    var $searchBtn = $searchWrap.find('.seacrh-btn'); //搜索按钮
    var isInit = true;
    var savaData = {};
    //点击列表获取
    $searchWrap.on('click', '.am-selected-list li', function () {
        var _index = $(this).attr('data-index'); //每个下拉框列表索引值
        var dropIndex = $('.am-selected-list').index($(this).parent());
        //console.log(dropIndex);
        var $curSelect = $(this).parents('.am-dropdown').prev().find('option');
        $curSelect.eq(_index).attr('selected', true);
        //console.log($curSelect.eq(_index).html());
        if (dropIndex == 1 || dropIndex == 2 || dropIndex == 4 || dropIndex == 5) {
            var regionId = $curSelect.eq(_index).attr('value');
            //console.log(regionId);
            var $nextSelect = $(this).parents('.am-dropdown').next();
            getRegionList($nextSelect, regionId);
        }
    });

    //搜索提交
    $searchBtn.on('click', function () {
        var param = $form.serialize();
        console.log(param);
        //location.search = param;
        //数据列表
        getIndexList(param);
        //return false;
    });

    getCategory();
    getRegionList($('.s-province'), 109000000);
    getIndexList();
    //获取煤炭种类
    function getCategory() {
        var $kinds = $('#category-list');
        var str = '';
        $.get('/api/RoadIndexApi/GetSCategoryList', function (data) {
            if (data && data.IsSuccess) {
                var aList = data.Data;
                for (var i = 0, len = aList.length; i < len; i++) {
                    str += '<option value="' + aList[i].Id + '">' + aList[i].CategoryName + '</option>';
                }
                str = '<option value="0">全部</option>' + str;
                //console.log(str);
                $kinds.html(str);
            }

        });
    }

    //获取省市列表
    function getRegionList(obj, id) {
        var str = '';
        $.get('/api/RoadIndexApi/GetSRegionListByParentId?ParentId=' + id, function (data) {
            if (data && data.IsSuccess) {
                var aList = data.Data;
                for (var i = 0, len = aList.length; i < len; i++) {
                    str += '<option value="' + aList[i].Id + '">' + aList[i].RegionName + '</option>';
                }
                str = '<option value=" ">全部</option>' + str;
                id == 109000000 ? obj.append(str) : obj.html(str);
            }
        });
    }

    //获取公路指数列表
    function getIndexList(param, opts) {
        $.ajax({
            type: 'POST',
            url: '/api/RoadIndexApi/GetHighwayIndexList',
            data: param ? toJson(param) : { parm: '' },
            dataType: 'json',
            timeout: 3000,
            async: false,
            success: function (data) {
                console.log(data);
                var $tBody = $('#highway-index-tbody');
                var str = '';
                if (data && data.IsSuccess) {
                    var aList = data.Data;
                    savaData = data.Data;
                    var len = aList.length;
                    if (len < 10) {
                        len = len;
                    } else {
                        len = 10;
                    }
                    for (var i = 0; i < len; i++) {
                        str += '<tr>' +
                          '<td>' + (i + 1) + '</td>' +
                          '<td>' + aList[i].BeginAddressName + '</td>' +
                          '<td>' + aList[i].StarProvinceName + '</td>' +
                          '<td>' + aList[i].StartCityName + '</td>' +
                          '<td>' + aList[i].StartSubName + '</td>' +
                          '<td>' + aList[i].EndAddressName + '</td>' +
                          '<td>' + aList[i].EndProvinceName + '</td>' +
                          '<td>' + aList[i].EndCityName + '</td>' +
                          '<td>' + aList[i].EndSubName + '</td>' +
                          '<td>' + aList[i].CurrentPrice + '</td>' +
                          '<td>' + aList[i].CategoryName + '</td>' +
                          '<td><a href="/RoadIndex/LineChart1?highwayIndexId=' + aList[i].Id + '&Begin=' + aList[i].BeginAddressName + '&End=' + aList[i].EndAddressName + '">' +
                          '<i class="am-icon-line-chart"></i></a></td>' +
                          '</tr>';
                    }
                    var pagesNum = Math.ceil(len / 10);
                    $tBody.html(str);
                    getPages(pagesNum);
                }
            }
        });
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
    //分页
    function getPages(num) {
        isInit = false;
        var pagination = new Pagination({
            wrap: $('.am-pagination'), // 存放分页内容的容器
            count: num, // 总页数
            current: 1, // 当前的页数（默认为1）
            prevText: '上一页', // prev 按钮的文本内容
            nextText: '下一页', // next 按钮的文本内容
            callback: function (page) { // 每一个页数按钮的回调事件
                var startIndex = (page - 1) * 10;
                var endIndex = page * 10;
                var str = '';
                if (endIndex > savaData.length) {
                    endIndex = savaData.length;
                };
                for (var i = startIndex; i < endIndex; i++) {
                    str += '<tr>' +
                      '<td>' + (i + 1) + '</td>' +
                      '<td>' + aList[i].BeginAddressName + '</td>' +
                      '<td>' + aList[i].EndAddressName + '</td>' +
                      '<td>' + aList[i].CurrentPrice + '</td>' +
                      '<td>' + aList[i].CategoryName + '</td>' +
                      '<td><a href="/RoadIndex/LineChart1?highwayIndexId=' + aList[i].Id + '&Begin=' + aList[i].BeginAddressName + '&End=' + aList[i].EndAddressName + '">' +
                      '<i class="am-icon-line-chart"></i></a></td>' +
                      '</tr>';
                };
                $('#highway-index-tbody').html(str);
            }
        });
    }
})();

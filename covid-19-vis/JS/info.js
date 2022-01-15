$(function(){

    
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    var Request = new Object();
    Request = GetRequest();
    // var 参数1,参数2,参数3,参数N;
    var health = Request['health'];

    //alert(GetQueryString("health"));

    var citys = [];
    var data = [];
    var datas = [];

    var container = new Vue({
        el:"#container",
        data:{

        },
        methods:{
            allCure(event)
            {
                $.ajax({
                    type : "GET", //请求方式
                    async: false, // fasle表示同步请求，true表示异步请求
                    contentType: "application/json;charset=UTF-8", //请求的媒体类型
                    url : "http://101.35.156.227:20002/home/CityInfoByHealth?health=0",//请求地址
                    success : function(result) { //请求成功
                        console.log(result);
                        var dataList = result.data;
                        datas = [];
                        citys=[];
                        $.each(dataList,function(n,value){
                            var item = {};
                            //只考虑确诊的
                            var index = value.province.indexOf("省");
                            var provice = value.province.substring(0,index);
                            //console.log(provice);
                            item.provice = provice;
                            item.confirm = value.confirm;
                            item.cure = value.cure;
                            item.death = value.death;
                            datas.push(item);
                            citys.push(provice);
                        });
                    //     console.log(datas);
                    //     console.log(citys);
                    },
                    error : function(e){  //请求失败，包含具体的错误信息
                        console.log(e.status);
                        console.log(e.responseText);
                    }
                });


                data = [];
                $.each(datas,function(n,value){
                    //console.log(citys[n]);
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[n]);
                        data.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter.lng, cityCenter.lat]
                            },
                            value: [
                                    value.confirm,
                                    value.cure,
                                    value.death
                                ],
                            // 设置总高度，每段会根据比例生成各自的高度
                            // height: 200 * 1000 + Math.random() * 200 * 1000,
                            // 同时支持函数设置和数组
                            height: function (value, index, array) {
                                return value * 10000;
                            },
                            size: 30 * 1000,
                            color: ['rgba(255,193,7, 1)', 'rgba(40,167,69, 1)', 'rgba(220,53,69, 1)']
                        });
                });
                layer.setData(data);
            },
            allDeath(event)
            {
                $.ajax({
                    type : "GET", //请求方式
                    async: false, // fasle表示同步请求，true表示异步请求
                    contentType: "application/json;charset=UTF-8", //请求的媒体类型
                    url : "http://101.35.156.227:20002/home/CityInfoByHealth?health=2",//请求地址
                    success : function(result) { //请求成功
                        console.log(result);
                        var dataList = result.data;
                        datas = [];
                        citys=[];
                        $.each(dataList,function(n,value){
                            var item = {};
                            //只考虑确诊的
                            var index = value.province.indexOf("省");
                            var provice = value.province.substring(0,index);
                            //console.log(provice);
                            item.provice = provice;
                            item.confirm = value.confirm;
                            item.cure = value.cure;
                            item.death = value.death;
                            datas.push(item);
                            citys.push(provice);
                        });
                    //     console.log(datas);
                    //     console.log(citys);
                    },
                    error : function(e){  //请求失败，包含具体的错误信息
                        console.log(e.status);
                        console.log(e.responseText);
                    }
                });


                data = [];
                $.each(datas,function(n,value){
                    //console.log(citys[n]);
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[n]);
                        data.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter.lng, cityCenter.lat]
                            },
                            value: [
                                    value.confirm,
                                    value.cure,
                                    value.death
                                ],
                            // 设置总高度，每段会根据比例生成各自的高度
                            // height: 200 * 1000 + Math.random() * 200 * 1000,
                            // 同时支持函数设置和数组
                            height: function (value, index, array) {
                                return value * 10000;
                            },
                            size: 30 * 1000,
                            color: ['rgba(255,193,7, 1)', 'rgba(40,167,69, 1)', 'rgba(220,53,69, 1)']
                        });
                });
                layer.setData(data);
            },
            allConfirm(event)
            {
                $.ajax({
                    type : "GET", //请求方式
                    async: false, // fasle表示同步请求，true表示异步请求
                    contentType: "application/json;charset=UTF-8", //请求的媒体类型
                    url : "http://101.35.156.227:20002/home/CityInfoByHealth?health=1",//请求地址
                    success : function(result) { //请求成功
                        console.log(result);
                        var dataList = result.data;
                        datas = [];
                        citys=[];
                        $.each(dataList,function(n,value){
                            var item = {};
                            //只考虑确诊的
                            var index = value.province.indexOf("省");
                            var provice = value.province.substring(0,index);
                            //console.log(provice);
                            item.provice = provice;
                            item.confirm = value.confirm;
                            item.cure = value.cure;
                            item.death = value.death;
                            datas.push(item);
                            citys.push(provice);
                        });
                    //     console.log(datas);
                    //     console.log(citys);
                    },
                    error : function(e){  //请求失败，包含具体的错误信息
                        console.log(e.status);
                        console.log(e.responseText);
                    }
                });


                data = [];
                $.each(datas,function(n,value){
                    //console.log(citys[n]);
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[n]);
                        data.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter.lng, cityCenter.lat]
                            },
                            value: [
                                    value.confirm,
                                    value.cure,
                                    value.death
                                ],
                            // 设置总高度，每段会根据比例生成各自的高度
                            // height: 200 * 1000 + Math.random() * 200 * 1000,
                            // 同时支持函数设置和数组
                            height: function (value, index, array) {
                                return value * 10000;
                            },
                            size: 30 * 1000,
                            color: ['rgba(255,193,7, 1)', 'rgba(40,167,69, 1)', 'rgba(220,53,69, 1)']
                        });
                });
                layer.setData(data);
            },
            allData(event)
            {
                $.ajax({
                    type : "GET", //请求方式
                    async: false, // fasle表示同步请求，true表示异步请求
                    contentType: "application/json;charset=UTF-8", //请求的媒体类型
                    url : "http://101.35.156.227:20002/home/CityInfo",//请求地址
                    success : function(result) { //请求成功
                        console.log(result);
                        var dataList = result.data;
                        datas = [];
                        citys=[];
                        $.each(dataList,function(n,value){
                            var item = {};
                            //只考虑确诊的
                            var index = value.province.indexOf("省");
                            var provice = value.province.substring(0,index);
                            //console.log(provice);
                            item.provice = provice;
                            item.confirm = value.confirm;
                            item.cure = value.cure;
                            item.death = value.death;
                            datas.push(item);
                            citys.push(provice);
                        });
                    //     console.log(datas);
                    //     console.log(citys);
                    },
                    error : function(e){  //请求失败，包含具体的错误信息
                        console.log(e.status);
                        console.log(e.responseText);
                    }
                });


                data = [];
                $.each(datas,function(n,value){
                    //console.log(citys[n]);
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[n]);
                        data.push({
                            geometry: {
                                type: 'Point',
                                coordinates: [cityCenter.lng, cityCenter.lat]
                            },
                            value: [
                                    value.confirm,
                                    value.cure,
                                    value.death
                                ],
                            // 设置总高度，每段会根据比例生成各自的高度
                            // height: 200 * 1000 + Math.random() * 200 * 1000,
                            // 同时支持函数设置和数组
                            height: function (value, index, array) {
                                return value * 10000;
                            },
                            size: 30 * 1000,
                            color: ['rgba(255,193,7, 1)', 'rgba(40,167,69, 1)', 'rgba(220,53,69, 1)']
                        });
                });
                layer.setData(data);
            }
        }
    });


    $.ajax({
        type : "GET", //请求方式
        async: false, // fasle表示同步请求，true表示异步请求
        contentType: "application/json;charset=UTF-8", //请求的媒体类型
        url : "http://101.35.156.227:20002/home/CityInfoByHealth?health="+health,//请求地址
        success : function(result) { //请求成功
            //console.log(result);
            var dataList = result.data;
            $.each(dataList,function(n,value){
                var item = {};
                //只考虑确诊的
                var index = value.province.indexOf("省");
                var provice = value.province.substring(0,index);
                //console.log(provice);
                item.provice = provice;
                item.confirm = value.confirm;
                item.cure = value.cure;
                item.death = value.death;
                datas.push(item);
                citys.push(provice);
            });
            console.log(datas);
            console.log(citys);
        },
        error : function(e){  //请求失败，包含具体的错误信息
            console.log(e.status);
            console.log(e.responseText);
        }
    });

        // console.log(datas);
        // console.log(citys);

        var map = initMap({
            tilt: 40,
            heading: 0,
            center: [109.792816,27.702774],
            zoom: 6,
            style: darkStyle,
            skyColors: [
                // 地面颜色
                'rgba(226, 237, 248, 0)',
                // 天空颜色
                'rgba(186, 211, 252, 1)'
            ]
        });


        $.each(datas,function(n,value){
            console.log(citys[n]);
            var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[n]);
                data.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [cityCenter.lng, cityCenter.lat]
                    },
                    value: [
                            value.confirm,
                            value.cure,
                            value.death
                        ],
                    // 设置总高度，每段会根据比例生成各自的高度
                    // height: 200 * 1000 + Math.random() * 200 * 1000,
                    // 同时支持函数设置和数组
                    height: function (value, index, array) {
                        return value * 10000;
                    },
                    size: 30 * 1000,
                    color: ['rgba(255,193,7, 1)', 'rgba(40,167,69, 1)', 'rgba(220,53,69, 1)']
                });
        });


        
        var view = new mapvgl.View({
            map: map
        });

        var layer = new mapvgl.BarLayer({
            // size: 20 * map.getZoomUnits(),
            // 柱体的边数，可设置较大值趋近圆柱
            edgeCount: 50,
            // color: ['blue', 'green', 'yellow', 'red']
            // color: function (value, index, array) {
            //     var max = 0;
            //     var min = 0;
            //     array.forEach(function (a) {
            //         if (max < a) {
            //             max = a;
            //         }
            //         if (min > a) {
            //             min = a;
            //         }
            //     });
            //     let val = parseInt(value / (max - min) * 255, 10);
            //     return 'rgba( 0, ' + val + ',' + (255 - val) + ', 1)';
            // }
        });
        view.addLayer(layer);
        layer.setData(data);

})


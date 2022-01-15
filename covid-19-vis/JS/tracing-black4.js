$(function(){

    var container = new Vue({
        el:"#container",
        data:{
        },
        methods:{
            allData(event)
            {
                axios.get('http://101.35.156.227:20003/border/borderInfo?city=*')
                .then((response) => {
                    if(response.data.status=="200")
                    {
                        index.title = "全国境外疫情";
                        borderInfoList = [];
                        // console.log(response.data.data);
                        document.cookie="borderInfo="+response.data.data;
                        obj = response.data.data;
                        $.each(obj, function (n, value) {
                            if(citys.indexOf(value.startCity)==-1)
                            {
                                citys.push(value.startCity);
                            }
                            if(citys.indexOf(value.endCity)==-1)
                            {
                                citys.push(value.endCity);
                            }

                            var object = {};
                            if(value.flag == 1)
                            {
                                object.flag = "航班号";
                            }else if(value.flag == 2)
                            {
                                object.flag = "高铁号";
                            }
                            object.realName = value.realName;
                            object.startCity = value.startCity;
                            object.endCity = value.endCity;
                            object.number = value.number;
                            object.startLat = value.startLat;
                            object.startLng = value.startLng;
                            object.endLat = value.endLat;
                            object.endLng = value.endLng;

                            var str =   " <div class=\"card card-danger\">\n" +
                            "                <div class=\"card-header\">\n" +
                            "                  <h3 class=\"card-title\">"+ object.realName+"</h3>\n" +
                            "                  <div class=\"card-tools\">\n" +
                            "                    <button type=\"button\" class=\"btn btn-tool\" data-card-widget=\"collapse\"><i class=\"fas fa-minus\"></i>\n" +
                            "                    </button>\n" +
                            "                  </div>\n" +
                            "                  <!-- /.card-tools -->\n" +
                            "                </div>\n" +
                            "                <!-- /.card-header -->\n" +
                            "                <div class=\"card-body\">\n" +
                            "                  <div>"+object.flag+":"+ value.number +"</div>\n" +
                            "                  <div>出发城市:"+ object.startCity+"</div>\n" +
                            "                  <div>达到城市:"+ object.endCity+"</div>\n" +
                            "                  <div>状况:确诊</div>\n" +
                            "                </div>\n" +
                            "                <!-- /.card-body -->\n" +
                            "              </div>";

                            index.content +=str;
                            borderInfoList.push(object);
                        });
                        //console.log(borderInfoList);

                        index.subtitle = "全国确诊" + borderInfoList.length+ "人";
                            LinData = [];
                            lineLayer2.setData(LinData);
                            lineLayer1.setData(LinData);
                            //将轨迹用飞线显示
                            for(var i = 0;i<borderInfoList.length;i++)
                            {
                                // 构造数据
                                //var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].startCity);
                                //var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].endCity);
                                var length = 0;
                                //console.log(borderInfoList[i].startCity);
                                //console.log(startPoint);
                                var startPoint = map.lnglatToMercator(borderInfoList[i].startLng, borderInfoList[i].startLat);
                                var endPoint = map.lnglatToMercator(borderInfoList[i].endLng, borderInfoList[i].endLat);

                                curve.setOptions({
                                    start: [startPoint[0], startPoint[1]],
                                    end: [endPoint[0], endPoint[1]],
                                });
                                var curveModelData = curve.getPoints(60);

                                LinData.push({
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: curveModelData
                                    },
                                    properties: {
                                        count: Math.random()
                                    }
                                });

                            }

                            view.removeLayer(lineLayer1);
                            lineLayer1 = new mapvgl.LineTripLayer({
                                color: 'rgb(255,20,147,0.8)', // 飞线动画颜色
                                step: 0.3
                            });
                            view.addLayer(lineLayer1);

                            lineLayer1.setData(LinData.map(item => {
                                item.geometry.coordinates = item.geometry.coordinates.map(item => {
                                    item[2] += 3;
                                    return item;
                                });
                                return item;
                            }));

                            lineLayer2 = new mapvgl.SimpleLineLayer({
                                blend: 'lighter',
                                color: 'rgb(255,20,147,0.8)' // 飞线颜色
                            });
                            view.removeLayer(lineLayer2)
                            view.addLayer(lineLayer2);
                            lineLayer2.setData(LinData);

                    }else{
                    alert("请求失败");
                    }
                });
            }
        }
    });

    var index = new Vue({
        el: "#content",
        data: {
         title: null,
         subtitle: null,
         content: ''
        },
        created() {

          this.title = "全国境外疫情";
          //this.init();
        },
        methods: {
            init(){
                var dom = document.getElementById("chart");
                let myChart = echarts.init(dom,'dark');
                if (myChart == null) { // 如果不存在，就进行初始化。
                    myChart = echarts.init(document.getElementById('chart'),'dark');
                }
                myChart.setOption(option,true);
                var app = {};

                var option;



                option = {
                title: {
                    text: 'Stacked Line'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                    saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    name: 'Email',
                    type: 'line',
                    stack: 'Total',
                    data: [120, 132, 101, 134, 90, 230, 210]
                    }
                ]
};

if (option && typeof option === 'object') {
    myChart.setOption(option);
}

            }
            }
      });

    //index.init();
    var LinData = [];
    var ripDataRed = [];
    var ripDataOrange = [];
    var citys = [];
    var borderInfoList = [];
    var lineLayer1;
    var lineLayer2;
    var rippleLayerRed;
    var rippleLayerpOranage;
    var rippleDataRed = [];
    var rippleDataOrange = [];

    var map = initMap({
        tilt: 41.8,
        heading: 0,
        center: [105.552849,28.847593],
        zoom: 6,
        style: purpleStyle
    });

    var curve = new mapvgl.BezierCurve();

    var view = new mapvgl.View({
        effects: [
            new mapvgl.BrightEffect({
                threshold: 0,
                blurSize: 2,
                clarity: 0.4
            }),
        ],
        map: map
    });

    var view1 = new mapvgl.View({
        effects: [
            new mapvgl.BrightEffect({
                threshold: 0,
                blurSize: 2,
                clarity: 0.4
            }),
        ],
        map: map
    });

    axios.get('http://101.35.156.227:20003/border/cityRisk')
    .then((response) => {
        if(response.data.status=="200")
        {
            obj = response.data.data;
            console.log(response.data.data);
            $.each(obj, function (n, value) {

                if(value.risk==0)
                {
                    var redItem = {};
                    redItem.city = value.city;
                    redItem.lat = value.lat;
                    redItem.lng = value.lng;
                    redItem.risk = value.risk;
                    rippleDataRed.push(redItem);
                }
                if(value.risk==1)
                {
                    var orangeItem = {};
                    orangeItem.city = value.city;
                    orangeItem.lat = value.lat;
                    orangeItem.lng = value.lng;
                    orangeItem.risk = value.risk;
                    rippleDataOrange.push(orangeItem);
                }

            });

            //将城市全部用波点显示
            for(var i=0;i<rippleDataRed.length;i++)
            {
                //var cityCenter = mapv.utilCityCenter.getCenterByCityName(rippleDataRed[parseInt(i)]);
                ripDataRed.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [rippleDataRed[i].lng, rippleDataRed[i].lat],
                        city: rippleDataRed[parseInt(i)].city,
                        risk: rippleDataRed[i].risk
                    }
                });
            }

            for(var i=0;i<rippleDataOrange.length;i++)
                {
                    //var cityCenter = mapv.utilCityCenter.getCenterByCityName(rippleDataOrange[parseInt(i)]);
                    ripDataOrange.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [rippleDataOrange[i].lng, rippleDataOrange[i].lat],
                            city: rippleDataOrange[parseInt(i)].city,
                            risk: rippleDataOrange[i].risk
                        }
                    });
                }
        }});

    //初始化信息
    axios.defaults.withCredentials = true;
    // console.log(axios.defaults);
    axios.get('http://101.35.156.227:20003/border/borderInfo?city=*')
    .then((response) => {
        if(response.data.status=="200")
        {
            // console.log(response.data.data);
            document.cookie="borderInfo="+response.data.data;
            obj = response.data.data;
            $.each(obj, function (n, value) {
                if(citys.indexOf(value.startCity)==-1)
                {
                    citys.push(value.startCity);
                }
                if(citys.indexOf(value.endCity)==-1)
                {
                    citys.push(value.endCity);
                }

                var object = {};
                if(value.flag == 1)
                {
                    object.flag = "航班号";
                }else if(value.flag == 2)
                {
                    object.flag = "高铁号";
                }
                object.realName = value.realName;
                object.startCity = value.startCity;
                object.endCity = value.endCity;
                object.number = value.number;
                object.startLat = value.startLat;
                object.startLng = value.startLng;
                object.endLat = value.endLat;
                object.endLng = value.endLng;

                var str =   " <div class=\"card card-danger\">\n" +
                "                <div class=\"card-header\">\n" +
                "                  <h3 class=\"card-title\">"+ object.realName+"</h3>\n" +
                "                  <div class=\"card-tools\">\n" +
                "                    <button type=\"button\" class=\"btn btn-tool\" data-card-widget=\"collapse\"><i class=\"fas fa-minus\"></i>\n" +
                "                    </button>\n" +
                "                  </div>\n" +
                "                  <!-- /.card-tools -->\n" +
                "                </div>\n" +
                "                <!-- /.card-header -->\n" +
                "                <div class=\"card-body\">\n" +
                "                  <div>"+object.flag+":"+ value.number +"</div>\n" +
                "                  <div>出发城市:"+ object.startCity+"</div>\n" +
                "                  <div>达到城市:"+ object.endCity+"</div>\n" +
                "                  <div>状况:确诊</div>\n" +
                "                </div>\n" +
                "                <!-- /.card-body -->\n" +
                "              </div>";

                index.content +=str;
                borderInfoList.push(object);
                
            });
            //console.log(borderInfoList);

            index.subtitle = "全国确诊" + borderInfoList.length+ "人";

                //将轨迹用飞线显示
                for(var i = 0;i<borderInfoList.length;i++)
                {
                    // 构造数据
                    //var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].startCity);
                    //var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].endCity);
                    var length = 0;
                    //console.log(borderInfoList[i].startCity);
                    //console.log(startPoint);
                    var startPoint = map.lnglatToMercator(borderInfoList[i].startLng, borderInfoList[i].startLat);
                    var endPoint = map.lnglatToMercator(borderInfoList[i].endLng, borderInfoList[i].endLat);

                    curve.setOptions({
                        start: [startPoint[0], startPoint[1]],
                        end: [endPoint[0], endPoint[1]],
                    });
                    var curveModelData = curve.getPoints(60);

                    LinData.push({
                        geometry: {
                            type: 'LineString',
                            coordinates: curveModelData
                        },
                        properties: {
                            count: Math.random()
                        }
                    });

                }

                lineLayer1 = new mapvgl.LineTripLayer({
                    color: 'rgb(255,20,147,0.8)', // 飞线动画颜色
                    step: 0.3
                });
                view.addLayer(lineLayer1);

                lineLayer1.setData(LinData.map(item => {
                    item.geometry.coordinates = item.geometry.coordinates.map(item => {
                        item[2] += 3;
                        return item;
                    });
                    return item;
                }));

                lineLayer2 = new mapvgl.SimpleLineLayer({
                    blend: 'lighter',
                    color: 'rgb(255,20,147,0.8)' // 飞线颜色
                });
                view.addLayer(lineLayer2);
                lineLayer2.setData(LinData);

        }else{
        alert("请求失败");
        }
    });

    // console.log(LinData);
    // 构造数据

    var view = new mapvgl.View({
        map: map
    });

    var rippleLayerRed = new mapvgl.RippleLayer({
        size: 500000,
        unit: 'm',
        color: 'rgb(255, 51, 0)',
        enablePicked: true,
        onRightClick: (e) =>{
            console.log(e);
            var cityName = e.dataItem.geometry.city;
            var lng = e.dataItem.geometry.coordinates[0];
            var lat = e.dataItem.geometry.coordinates[1];
            var labelLayerData = [];
            var patientNumber = 0;
            axios.defaults.withCredentials = true;
            axios.get('http://101.35.156.227:20003/border/targetCityPatient?city='+cityName)
            .then((response) => {
                if(response.data.status=="200")
                {
                    obj = response.data.data;
                    $.each(obj, function (n, value) {
                        patientNumber = patientNumber+1;
                    });
                    labelLayerData.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [lng, lat],
                        },
                        properties: {
                            text: cityName + '\n' + "境外确诊:"+ patientNumber +"人",
                        },
                    });
                    var layer = new mapvgl.LabelLayer({
                        textAlign: 'center',
                        textColor: '#fc0',
                        borderColor: '#666',
                        backgroundColor: '#666',
                        padding: [2, 5],
                        borderRadius: 5,
                        fontSize: 12,
                        lineHeight: 16,
                        collides: true, // 是否开启碰撞检测, 数量较多时建议打开
                        enablePicked: true,
                        onClick: e => {
                            // 点击事件
                            console.log('click', e);
                        },
                    });
                    view.addLayer(layer);
                    layer.setData(labelLayerData);
        
                    //显示3秒
                    setTimeout(()=>{
                        labelLayerData = [];
                        layer.setData(labelLayerData);
                    }, 3000);
        
                }
            });
        },
        onClick: (e) => { // 点击事件
            //console.log(e.dataItem.geometry.risk);
            // if(e.dataItem.geometry.risk==0)
            // {
            //     alert("red");
            // }
            //console.log(e.dataItem.geometry.city);
            var data = [];
            //获取当前城市检测出病情的患者轨迹
            axios.defaults.withCredentials = true;
            axios.get('http://101.35.156.227:20003/border/targetCityPatient?city='+e.dataItem.geometry.city)
            .then((response) => {
            var patientNumber = 0;
            if(response.data.status=="200")
            {
                // console.log(response.data.data);
                var borderInfo = [];
                obj = response.data.data;
                index.content = '';
                $.each(obj, function (n, value) {
                    var object = {};
                    if(value.flag == 1)
                    {
                        object.flag = "航班号";
                    }else if(value.flag == 2)
                    {
                        object.flag = "高铁号";
                    }
                    object.realName = value.realName;
                    object.startCity = value.startCity;
                    object.endCity = value.endCity;
                    object.number = value.number;
                    object.startLat = value.startLat;
                    object.startLng = value.startLng;
                    object.endLat = value.endLat;
                    object.endLng = value.endLng;
                    var str =   " <div class=\"card card-danger\">\n" +
                "                <div class=\"card-header\">\n" +
                "                  <h3 class=\"card-title\">"+ object.realName+"</h3>\n" +
                "                  <div class=\"card-tools\">\n" +
                "                    <button type=\"button\" class=\"btn btn-tool\" data-card-widget=\"collapse\"><i class=\"fas fa-minus\"></i>\n" +
                "                    </button>\n" +
                "                  </div>\n" +
                "                  <!-- /.card-tools -->\n" +
                "                </div>\n" +
                "                <!-- /.card-header -->\n" +
                "                <div class=\"card-body\">\n" +
                "                  <div>"+object.flag+":"+ value.number +"</div>\n" +
                "                  <div>出发城市:"+ object.startCity+"</div>\n" +
                "                  <div>达到城市:"+ object.endCity+"</div>\n" +
                "                  <div>状况:确诊</div>\n" +
                "                </div>\n" +
                "                <!-- /.card-body -->\n" +
                "              </div>";
                    index.title = e.dataItem.geometry.city + "市境外案例";
                    index.content +=str;
                    borderInfo.push(object);
                    patientNumber = borderInfo.length;
                });

                index.subtitle = e.dataItem.geometry.city +"市确诊"+ patientNumber+"人";
                //index.init();

                for(var i = 0;i<borderInfo.length;i++)
                {
                    // 构造数据
                    //var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].startCity);
                    //var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].endCity);
                    var length = 0;
                    var startPoint = map.lnglatToMercator(borderInfo[i].startLng, borderInfo[i].startLat);
                    var endPoint = map.lnglatToMercator(borderInfo[i].endLng, borderInfo[i].endLat);

                    curve.setOptions({
                        start: [startPoint[0], startPoint[1]],
                        end: [endPoint[0], endPoint[1]]
                    });
                    var curveModelData = curve.getPoints(60);

                    data.push({
                        geometry: {
                            type: 'LineString',
                            coordinates: curveModelData
                        },
                        properties: {
                            count: Math.random()
                        }
                    });
                }

                lineLayer1.setData(data.map(item => {
                    item.geometry.coordinates = item.geometry.coordinates.map(item => {
                        item[2] += 3;
                        return item;
                    });
                    return item;
                }));

                lineLayer2.setData(data)
            }
            });
        },
    });

    var rippleLayerpOranage = new mapvgl.RippleLayer({
        size: 800000,
        unit: 'm',
        color: 'rgb(255, 51, 0)',
        enablePicked: true,
        onClick: (e) => { // 点击事件
            //console.log(e.dataItem.geometry.risk);
            // if(e.dataItem.geometry.risk==1)
            // {
            //     alert("orange");
            // }
            // var data = [];
            // //获取当前城市检测出病情的患者轨迹
            // axios.defaults.withCredentials = true;
            // axios.get('http://101.35.156.227:20002/border/targetCityPatient?city='+e.dataItem.geometry.city)
            // .then((response) => {
            // if(response.data.status=="200")
            // {
            //     // console.log(response.data.data);
            //     var borderInfo = [];
            //     obj = response.data.data;
            //     $.each(obj, function (n, value) {
            //         var object = {};
            //         if(value.flag == 1)
            //         {
            //             object.flag = "航班号";
            //         }else if(value.health == 2)
            //         {
            //             object.flag = "高铁号";
            //         }
            //         object.realName = value.realName;
            //         object.startCity = value.startCity;
            //         object.endCity = value.endCity;
            //         object.number = value.number;
            //         borderInfo.push(object);
            //     });

            //     for(var i = 0;i<borderInfo.length;i++)
            //     {
            //         // 构造数据
            //         var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].startCity);
            //         var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].endCity);
            //         var length = 0;
            //         var startPoint = map.lnglatToMercator(startPoint.lng, startPoint.lat);
            //         var endPoint = map.lnglatToMercator(endPoint.lng, endPoint.lat);

            //         curve.setOptions({
            //             start: [startPoint[0], startPoint[1]],
            //             end: [endPoint[0], endPoint[1]]
            //         });
            //         var curveModelData = curve.getPoints(60);

            //         data.push({
            //             geometry: {
            //                 type: 'LineString',
            //                 coordinates: curveModelData
            //             },
            //             properties: {
            //                 count: Math.random()
            //             }
            //         });
            //     }

            //     lineLayer1.setData(data.map(item => {
            //         item.geometry.coordinates = item.geometry.coordinates.map(item => {
            //             item[2] += 3;
            //             return item;
            //         });
            //         return item;
            //     }));

            //     lineLayer2.setData(data)
            // }
            // });
        },
    });


    rippleLayerRed.setData(ripDataRed);
    rippleLayerpOranage.setData(ripDataOrange);
    view.addLayer(rippleLayerpOranage);
    view.addLayer(rippleLayerRed);

    setTimeout(() => {
        rippleLayerRed.setOptions({
            size: 60,
            duration: 1,
            unit: 'px',
            color: 'rgb(255, 51, 0)'
        });
    }, 4000);

    setTimeout(() => {
        rippleLayerpOranage.setOptions({
            size: 50,
            duration: 4,
            unit: 'px',
            color: 'rgb(254,142,70)'
        });
    }, 4000);

})
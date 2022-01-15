$(function(){

    var index = new Vue({
        el: "#content",
        data: {
         title: null,
         content: ''
        },
        created() {

          this.title = "全国境外疫情";
          this.init();
        },
        methods: {
            init(){

            }
            }
      });


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
        zoom: 5,
        style: purpleStyle
    });

    var curve = new mapvgl.BezierCurve();

    var view = new mapvgl.View({
        // postProcessing: new mapvgl.PostProcessing({
        //     passes: [{
        //         name: 'unrealBloom',
        //         threshold: 0.0,
        //         strength: 1.5,
        //         radius: 1.0
        //     }]
        // }),
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
        // postProcessing: new mapvgl.PostProcessing({
        //     passes: [{
        //         name: 'unrealBloom',
        //         threshold: 0.0,
        //         strength: 1.5,
        //         radius: 1.0
        //     }]
        // }),
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
                    rippleDataRed.push(value.city);
                }
                if(value.risk==1)
                {
                    rippleDataOrange.push(value.city);
                }

            });

            //将城市全部用波点显示
            for(var i=0;i<rippleDataRed.length;i++)
            {
                var cityCenter = mapv.utilCityCenter.getCenterByCityName(rippleDataRed[parseInt(i)]);
                ripDataRed.push({
                    geometry: {
                        type: 'Point',
                        coordinates: [cityCenter.lng, cityCenter.lat],
                        city: rippleDataRed[parseInt(i)]
                    }
                });
            }

            for(var i=0;i<rippleDataOrange.length;i++)
                {
                    var cityCenter = mapv.utilCityCenter.getCenterByCityName(rippleDataOrange[parseInt(i)]);
                    ripDataOrange.push({
                        geometry: {
                            type: 'Point',
                            coordinates: [cityCenter.lng, cityCenter.lat],
                            city: rippleDataOrange[parseInt(i)]
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

                var str = "<div class=\"card-body\">\n" +
            "                <div class=\"card card-light card-outline\">\n" +
            "                  <div class=\"card-header\">\n" +
            "                    <h5 class=\"card-title\">境外患者——"+object.realName+"</h5>\n" +
            "                    <div class=\"card-tools\">\n" +
            "                        <i class=\"fas fa-pen\"></i>\n" +
            "                      </a>\n" +
            "                    </div>\n" +
            "                  </div>\n" +
            "                  <div class=\"card-body\">\n" +
            "                    <div>出发地:"+object.startCity+"</div>\n" +
            "                    <div>目的地:"+object.endCity+"</div>\n" +
            "                    <div>"+object.flag+":"+object.number+"</div>\n" +
            "                    \n" +
            "                  </div>\n" +
            "                </div>\n" +
            "              </div>";

                index.content +=str;
                borderInfoList.push(object);


            });

                //将轨迹用飞线显示
                // console.log(borderInfoList);
                for(var i = 0;i<borderInfoList.length;i++)
                {
                    // 构造数据
                    var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].startCity);
                    var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfoList[i].endCity);
                    var length = 0;
                    var startPoint = map.lnglatToMercator(startPoint.lng, startPoint.lat);
                    var endPoint = map.lnglatToMercator(endPoint.lng, endPoint.lat);

                    curve.setOptions({
                        start: [startPoint[0], startPoint[1]],
                        end: [endPoint[0], endPoint[1]]
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
                    color: 'rgb(108,29,32)', // 飞线动画颜色
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
                    color: 'rgb(108,29,32)' // 飞线颜色
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
        onClick: (e) => { // 点击事件
            console.log(e.dataItem.geometry.city);
            var data = [];
            //获取当前城市检测出病情的患者轨迹
            axios.defaults.withCredentials = true;
            axios.get('http://101.35.156.227:20002/border/targetCityPatient?city='+e.dataItem.geometry.city)
            .then((response) => {
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
                    var str = "<div class=\"card-body\">\n" +
                "                <div class=\"card card-light card-outline\">\n" +
                "                  <div class=\"card-header\">\n" +
                "                    <h5 class=\"card-title\">境外患者——"+object.realName+"</h5>\n" +
                "                    <div class=\"card-tools\">\n" +
                "                        <i class=\"fas fa-pen\"></i>\n" +
                "                      </a>\n" +
                "                    </div>\n" +
                "                  </div>\n" +
                "                  <div class=\"card-body\">\n" +
                "                    <div>出发地:"+object.startCity+"</div>\n" +
                "                    <div>目的地:"+object.endCity+"</div>\n" +
                "                    <div>"+object.flag+":"+object.number+"</div>\n" +
                "                    \n" +
                "                  </div>\n" +
                "                </div>\n" +
                "              </div>";
                    index.title = e.dataItem.geometry.city + "市境外案例";
                    index.content +=str;
                    borderInfo.push(object);
                });


                for(var i = 0;i<borderInfo.length;i++)
                {
                    // 构造数据
                    var startPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].startCity);
                    var endPoint = mapv.utilCityCenter.getCenterByCityName(borderInfo[i].endCity);
                    var length = 0;
                    var startPoint = map.lnglatToMercator(startPoint.lng, startPoint.lat);
                    var endPoint = map.lnglatToMercator(endPoint.lng, endPoint.lat);

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
        size: 500000,
        unit: 'm',
        color: 'rgb(255, 51, 0)',
        enablePicked: true,
        onClick: (e) => { // 点击事件
            //alert(1);
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
    view.addLayer(rippleLayerRed);
    view.addLayer(rippleLayerpOranage);

    setTimeout(() => {
        rippleLayerRed.setOptions({
            size: 50,
            duration: 4,
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
$(function(){
  //把检测到有患者确诊症状的城市用波纹标出来,点击波纹点,显示该城市所有境外输入案例患者的详细,
  //并用飞线标记,点击的波纹点呈选中的颜色,与该城市有关的波纹点呈橙色,其他的为黄色,同一患者的飞线颜色相同,
  //不同患者的飞线颜色不相同

  var map = initMap({
      tilt: 41.8,
      heading: 0,
      center: [105.552849,28.847593],
      zoom: 5,
      style: purpleStyle
  });

  var citys = [
      '北京', '天津', '上海', '重庆', '石家庄', '太原', '呼和浩特',
      '哈尔滨', '长春', '沈阳', '济南', '南京', '合肥', '杭州', '南昌', '福州',
      '郑州', '武汉', '长沙', '广州', '南宁', '西安', '银川', '兰州', '西宁',
      '乌鲁木齐', '成都', '贵阳', '昆明', '拉萨', '海口'
  ];

  var randomCount = 1; // 模拟的飞线的数量

  var curve = new mapvgl.BezierCurve();

  var data = [];

  // 构造数据
  while (randomCount--) {
      var startPoint = mapv.utilCityCenter.getCenterByCityName('北京');
      var endPoint = mapv.utilCityCenter.getCenterByCityName('广州');
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

  var lineLayer = new mapvgl.LineTripLayer({
      color: 'rgb(255, 255, 204)', // 飞线动画颜色
      step: 0.3
  });
  view.addLayer(lineLayer);

  lineLayer.setData(data.map(item => {
      item.geometry.coordinates = item.geometry.coordinates.map(item => {
          item[2] += 3;
          return item;
      });
      return item;
  }));

  var lineLayer = new mapvgl.SimpleLineLayer({
      blend: 'lighter',
      color: 'rgb(255, 153, 0, 0.6)' // 飞线颜色
  });
  view.addLayer(lineLayer);
  lineLayer.setData(data);

    var view = new mapvgl.View({
        map: map
    });

    var data = [];

    var randomCount = 50;

    // 构造数据
    while (randomCount--) {
        var cityCenter = mapv.utilCityCenter.getCenterByCityName(citys[parseInt(Math.random() * citys.length, 10)]);
        data.push({
            geometry: {
                type: 'Point',
                coordinates: [cityCenter.lng - 2 + Math.random() * 4, cityCenter.lat - 2 + Math.random() * 4]
            }
        });
    }

    var rippleLayer = new mapvgl.RippleLayer({
        size: 500000,
        unit: 'm',
        color: 'rgb(255, 51, 0)',
        enablePicked: true,
        onClick: (e) => { // 点击事件
            console.log(e);
        },
    });
    view.addLayer(rippleLayer);
    rippleLayer.setData(data);

    setTimeout(() => {
        rippleLayer.setOptions({
            size: 50,
            duration: 4,
            unit: 'px',
            color: 'rgb(255, 51, 0)'
        });
    }, 4000);

})
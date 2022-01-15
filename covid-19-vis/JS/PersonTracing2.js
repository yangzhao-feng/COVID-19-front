$(function()
{
    //创建地图实例
    var map = new BMapGL.Map("map_container");
    //设置中心点坐标
    var point = new BMapGL.Point(119.3604359887837, 32.11956603949539);
    //地图初始化，同时设置地图展示级别
    map.centerAndZoom(point, 15);

    // var  mapStyle ={
    //         style : "dark"  //设置地图风格为高端黑
    //     }
    //     map.setMapStyle(mapStyle);
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮

    var divStr = "<div>姓名:</div><div>地点:</div><div>时间:</div>";


    //获用户定位
    // axios.get("http://api.map.baidu.com/location/ip?ak=aCkho2YWwtnNf2ydI4uEVBfRpTo0Mp1b&coor=bd09ll")
    //       .then((response) => {
    //         console.log(response);
    //       });

    //获取本市患者的信息
    var info2Patient = [];
    axios.get("http://101.35.156.227:20003/adminInfo/InfoByHealthandAdd2?healthStatus="+"1"+"&address=江苏省镇江市")
          .then((response) => {
            if(response.data.status=="200")
            {
                obj = response.data.data;
                $.each(obj, function (n, value) {
                    var object = {};
                    if(value.health == 0)
                    {
                        object.health = "治愈";
                    }else if(value.health == 1)
                    {
                        object.health = "确诊";
                    }else if(value.health == 2)
                    {
                        object.health = "死亡";
                    }
                    object.realname = value.realname;
                    object.idNumber = value.idNumber;
                    object.starttime = value.starttime;
                    object.stoptime = value.stoptime;
                    object.place = value.place;
                    object.unit = value.unit;
                    object.lng = value.lng;
                    object.lat = value.lat;
                    info2Patient.push(object);

                    //创建图标
                    var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/virus.png", new BMapGL.Size(20, 20));
                    // 创建Marker标注，使用小车图标
                    var pt = new BMapGL.Point(info2Patient[n].lng,info2Patient[n].lat);
                    var marker = new BMapGL.Marker(pt, {
                        icon: myIcon
                    });
                    // // 将标注添加到地图
                    map.addOverlay(marker);

                    // var marker = new BMap.Marker(new BMapGL.Point(info2Patient[n].lng,info2Patient[n].lat));  // 创建标注
                    var content = "<div>姓名:"+info2Patient[n].realname+"</div><div>状况:"+info2Patient[n].health+"</div><div>地点:"+info2Patient[n].place+"</div>";
                    var toastContent = "<div>姓名:"+info2Patient[n].realname+"</div><div>状况:"+info2Patient[n].health+"</div><div>地点:"+info2Patient[n].place+"</div>"+
                    "<div>出发时间:"+info2Patient[n].starttime+"</div><div>离开时间:"+info2Patient[n].stoptime+"</div><div>负责单位:"+info2Patient[n].unit+"</div>";
                    // map.addOverlay(marker);               // 将标注添加到地图中
                    addClickHandler(content,marker,"患者轨迹",content,toastContent,1);
                });
                // console.log(info2Patient);
            }else{
              alert("请求失败");
            }
          });


        //获取本市危险小区的信息的信息
        var info2Community = [];
        axios.get("http://101.35.156.227:20003/community/ComInfoByAdd2?healthStatus="+"1"+"&address=江苏省镇江市")
            .then((response) => {
                if(response.data.status=="200")
                {
                    obj = response.data.data;
                    $.each(obj, function (n, value) {
                        var object = {};
                        if(value.riskLevel==0)
                        {
                            object.riskLevel = "无风险";
                        }else if(value.riskLevel==1)
                        {
                            object.riskLevel = "低风险";
                        }else if(value.riskLevel==2)
                        {
                            object.riskLevel = "中风险";
                        }else if(value.riskLevel==3)
                        {
                            object.riskLevel = "高风险";
                        }
                        object.place = value.place;
                        object.unit = value.unit;
                        object.lng = value.lng;
                        object.lat = value.lat;
                        info2Community.push(object);

                        //创建图标
                        var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/risk.png", new BMapGL.Size(40, 40));
                        // 创建Marker标注，使用小车图标
                        var pt = new BMapGL.Point(info2Community[n].lng,info2Community[n].lat);
                        var marker = new BMapGL.Marker(pt, {
                            icon: myIcon
                        });
                        // // 将标注添加到地图
                        map.addOverlay(marker);

                        //var marker = new BMapGL.Marker(new BMapGL.Point(info2Community[n].lng,info2Community[n].lat));  // 创建标注
                        var content = "<div>地点:"+info2Community[n].place+"</div><div>状况:"+info2Community[n].riskLevel+"</div><div>负责单位:"+info2Community[n].unit+"</div>";
                        map.addOverlay(marker);               // 将标注添加到地图中
                        addClickHandler(content,marker,"",content,content,0);
                    });
                    //console.log(info2Community);
                }else{
                alert("请求失败");
                }
            });

        //获取用户本市的轨迹
        var info2Trip = [];
        axios.get("http://101.35.156.227:20001/userInfo/tripInfo2?username="+"yang"+"&address=江苏省镇江市")
            .then((response) => {
                if(response.data.status=="200")
                {
                    obj = response.data.data;
                    console.log(obj)
                    $.each(obj, function (n, value) {
                        var object = {};
                        object.username = value.username;
                        object.starttime = value.starttime;
                        object.stoptime = value.stoptime;
                        object.place = value.place;
                        object.lng = value.lng;
                        object.lat = value.lat;
                        info2Trip.push(object);

                        //创建图标
                        var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/track.png", new BMapGL.Size(40, 40));
                        // 创建Marker标注，使用小车图标
                        var pt = new BMapGL.Point(info2Trip[n].lng,info2Trip[n].lat);
                        var marker = new BMapGL.Marker(pt, {
                            icon: myIcon
                        });
                        // // 将标注添加到地图
                        map.addOverlay(marker);
                        //var marker = new BMapGL.Marker(new BMapGL.Point(info2Trip[n].lng,info2Trip[n].lat));  // 创建标注
                        var content = "<div>用户名:"+info2Trip[n].username+"</div><div>地点:"+info2Trip[n].place+"</div>";
                        var ToastContent = "<div>用户名:"+info2Trip[n].username+"</div><div>地点:"+info2Trip[n].place+"</div><div>出发时间:"+info2Trip[n].starttime+"</div>"
                        +"</div><div>离开时间:"+info2Trip[n].stoptime+"</div>";
                        map.addOverlay(marker);               // 将标注添加到地图中
                        addClickHandlertoUser(content,marker,"用户轨迹",content,ToastContent,1);
                    });
                    // console.log(info2Trip);
                }else{
                alert("请求失败");
                }
            });

    // for(var i=0;i<info2Patient.length;i++){
    //     var marker = new BMap.Marker(new BMap.Point(info2Patient[i].lng,info2Patient[i].lat));  // 创建标注
    //     var content = "<div>姓名:"+info2Patient[i][0]+"</div><div>状况:"+info2Patient[i][1]+"</div><div>地点:"+info2Patient[i][5]+"</div><div>出发时间:</div>"+
    //                 "<div>出发时间:"+info2Patient[i][3]+"</div><div>离开时间:"+info2Patient[i][4]+"</div><div>负责单位:"+info2Patient[i][6]+"</div>";
    // map.addOverlay(marker);               // 将标注添加到地图中
    // addClickHandler(content,marker,info2Patient[i][0],content);
    // }
     /**标注的信息窗口**/
        // 创建信息窗口
        var opts = {
            width: 200,
            height: 130,
            title: '信息'
        };
    function addClickHandler(content,marker,title,content,ToastContent,hasToast){
        marker.addEventListener("click",function(e){
            openInfo(content,e)
            if(hasToast == 1)
            {
                $(document).Toasts('create', {
                    class: 'bg-danger',
                    title: title,
                    body: ToastContent
                })
            }
        }
        );
        }
    function addClickHandlertoUser(content,marker,title,content,ToastContent,hasToast){
        marker.addEventListener("click",function(e){
            openInfo(content,e)
            if(hasToast == 1)
            {
                $(document).Toasts('create', {
                    class: 'bg-success',
                    title: title,
                    body: ToastContent
                })
            }
        }
        );
        }
    function openInfo(content,e){
        var p = e.target;
        var point = new BMapGL.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMapGL.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }
})


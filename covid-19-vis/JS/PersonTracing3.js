$(function()
{

    var time = null;
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

    //获用户定位
    // axios.get("http://api.map.baidu.com/location/ip?ak=aCkho2YWwtnNf2ydI4uEVBfRpTo0Mp1b&coor=bd09ll")
    //       .then((response) => {
    //         console.log(response);
    //       });

     /**标注的信息窗口**/
        // 创建信息窗口
        var opts = {
            width: 200,
            height: 130,
            title: '信息'
        };
    function openInfo(content,e){
        var p = e.target;
        var point = new BMapGL.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMapGL.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
    }

    function getContent(patientList,tripList)
    {
         var htmlStr = "";
        var hopeTimeIndex = 0;
        if((patientList.length != 0&&tripList,length!=0)||patientList.length!=0)
        {
            $.each(patientList,function (n, value){
                var patientTimeIndex = value.timeIndex;
                //当前的日期下标是期待的日期下标
                if(patientTimeIndex == hopeTimeIndex)
                {
                    htmlStr = patientContentGet(value.realname,value.starttime,value.stoptime,value.health,htmlStr);
                    hopeTimeIndex++;
                }else{
                    //到用户列表中寻找
                    $.each(tripList,function (n, value){
                        var userTimeIndex = value.timeIndex
                        if(userTimeIndex == hopeTimeIndex)
                        {
                            htmlStr = userContentGet(value.username,value.starttime,value.stoptime,htmlStr);
                            hopeTimeIndex++;
                        }
                    });

                    //当前的日期下标是期待的日期下标
                    if(patientTimeIndex == hopeTimeIndex)
                    {
                        htmlStr = patientContentGet(value.realname,value.starttime,value.stoptime,value.health,htmlStr);
                        hopeTimeIndex++;
                    }
                }
            });
            $.each(tripList,function (n, value){
                var userTimeIndex = value.timeIndex
                if(userTimeIndex == hopeTimeIndex)
                {
                    htmlStr = userContentGet(value.username,value.starttime,value.stoptime,htmlStr);
                    hopeTimeIndex++;
                }
            });
        }else{
            //到用户列表中寻找
            $.each(tripList,function (n, value){
                var userTimeIndex = value.timeIndex
                if(userTimeIndex == hopeTimeIndex)
                {
                    htmlStr = userContentGet(value.username,value.starttime,value.stoptime,htmlStr);
                    hopeTimeIndex++;
                }
            });
        }


        var html = "<div>\n" +
        "                  <i class=\"fas fa-clock bg-gray\"></i>\n" +
        "                </div>";

        return htmlStr + html;


    }

    //获取单个用户轨迹的Html代码
    function userContentGet(name,startTime,endTime,htmlStr)
    {
        var userContent = "<div>\n" +
        "                  <i class=\"fas fa-user bg-green\"></i>\n" +
        "                  <div class=\"timeline-item\">\n" +
        "                    <div class=\"card bg-green\">\n" +
        "                      <div class=\"card-header\">\n" +
        "                        <h3 class=\"card-title\">"+ name +"</h3>\n" +
        "                        <div class=\"card-tools\">\n" +
        "                          <button type=\"button\" class=\"btn btn-tool\" data-card-widget=\"collapse\">\n" +
        "                            <i class=\"fas fa-minus\"></i>\n" +
        "                          </button>\n" +
        "                        </div>\n" +
        "                      </div>\n" +
        "                      <div class=\"card-body\">\n" +
        "                        <div>出发时间:"+ startTime +"</div>\n" +
        "                        <div>离开时间:"+ endTime +"</div>\n" +
        "                      </div>\n" +
        "                    </div>\n" +
        "                  </div>\n" +
        "                </div>"

        //判断时否需要创建一个新的日期标签
        if(time == null)
        {
            time = getTimeDate(startTime);
            var timeContent = dateContentGet(time);

            return htmlStr + timeContent + userContent;
        }else{
            var timeLast = getTimeDate(startTime);
            if(time != timeLast)
            {
                time = timeLast;
                var timeContent = dateContentGet(time);
                return htmlStr + timeContent + userContent;
            }else{
                return htmlStr + userContent
            }

        }


    }

    //获取单个患者轨迹的Html代码
    function patientContentGet(name,startTime,endTime,status,htmlStr)
    {
        var patientContent = "<div>\n" +
        "                  <i class=\"fas fa-user bg-red\"></i>\n" +
        "                  <div class=\"timeline-item\">\n" +
        "                    <div class=\"card bg-red\">\n" +
        "                      <div class=\"card-header\">\n" +
        "                        <h3 class=\"card-title\">"+ name +"</h3>\n" +
        "                        <div class=\"card-tools\">\n" +
        "                          <button type=\"button\" class=\"btn btn-tool\" data-card-widget=\"collapse\">\n" +
        "                            <i class=\"fas fa-minus\"></i>\n" +
        "                          </button>\n" +
        "                        </div>\n" +
        "                      </div>\n" +
        "                      <div class=\"card-body\">\n" +
        "                        <div>出发时间:"+ startTime +"</div>\n" +
        "                        <div>离开时间:"+ endTime +"</div>\n" +
        "                        <div>状态:"+ status +"</div>\n" +
        "                      </div>\n" +
        "                    </div>\n" +
        "                  </div>\n" +
        "                </div>";

        //判断时否需要创建一个新的日期标签
        if(time == null)
        {
            time = getTimeDate(startTime);
            var timeContent = dateContentGet(time);

            return htmlStr + timeContent + patientContent;
        }else{
            var timeLast = getTimeDate(startTime);
            if(time != timeLast)
            {
                time = timeLast;
                var timeContent = dateContentGet(time);
                return htmlStr + timeContent + patientContent;
            }else{
                return htmlStr + patientContent
            }

        }
    }

    //获取日期的Html代码
    function dateContentGet(date)
    {
        var content = "<div class=\"time-label\">\n" +
        "                  <span class=\"bg-gray\">"+ date +"</span>\n" +
        "                </div>"

        return content;

    }

    //截取日期
    function getTimeDate(startTime)
    {
        var index = startTime.indexOf(" ");
        // console.log(startTime.substr(0,index));
        return startTime.substr(0,index);

    }

    //添加监听事件
    function addClickHandler(marker,content){
        marker.addEventListener("click",function(e){
            //openInfo(content,e)
            var timeline = document.getElementById("timeline");
            timeline.innerHTML=content;
            // this.htmlStr = content;
            // console.log(content);
        }
        );
    }

    var info2Patient = [];
    var info2UserTrip = [];

    var index = new Vue({
        el: "#timeline",
        data: {
          time: null,
          htmlStr: "",
          timeIndex : 0
        },
        created() {
            //获取本市患者的信息
            axios.get("http://101.35.156.227:20003/adminInfo/riskCheckInfo?city=江苏省镇江市&username=yang")
            .then((response) => {
            if(response.data.status=="200")
            {
                time = null;
                obj = response.data.data;
                $.each(obj, function (n, value) {

                    info2Patient = [];
                    info2UserTrip = [];
                    //获取地址信息
                    var address = value.address;
                    var isRiskArea = value.isRiskArea;
                    var patientNumber = value.patientNumber;
                    var userTripNumber = value.userTripNumber;
                    var lng = value.lng;
                    var lat = value.lat;
                    console.log(address);

                    //获取患者列表
                    if(patientNumber > 0 )
                    {
                        patient = value.riskCheckPatientBOList;
                        $.each(patient,function(n,value) {
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
                            object.timeIndex = value.timeIndex;
                            getTimeDate(object.starttime);
                            info2Patient.push(object);
                        });
                    }

                    //获取用户轨迹列表
                    if(userTripNumber > 0 )
                    {
                        trip = value.riskCheckUserTripBOList;
                        $.each(trip,function(n,value) {
                            var object = {};
                            object.username = value.username;
                            object.starttime = value.starttime;
                            object.stoptime = value.stoptime;
                            object.place = value.place;
                            object.timeIndex = value.timeIndex;
                            info2UserTrip.push(object);
                        });
                    }

                    console.log(info2Patient);
                    console.log(info2UserTrip);

                    if(userTripNumber>0&&patientNumber<=0)
                    {
                        var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/track.png", new BMapGL.Size(25, 30));
                    }else if(userTripNumber<=0&&patientNumber>0)
                    {
                        var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/virus.png", new BMapGL.Size(25, 25));
                    }else{
                        var myIcon = new BMapGL.Icon("http://101.35.156.227:8089/static_resource/risk.png", new BMapGL.Size(25, 25));
                    }
                    // 创建Marker标注，使用小车图标
                    var pt = new BMapGL.Point(lng,lat);
                    var marker = new BMapGL.Marker(pt, {
                        icon: myIcon
                    });
                    // // 将标注添加到地图
                    map.addOverlay(marker);

                    var content = getContent(info2Patient,info2UserTrip);

                    addClickHandler(marker,content);
                });

                // console.log(info2Patient);
            }else{
                alert("请求失败");
            }
            });


        },
        methods: {
        }
      });


})


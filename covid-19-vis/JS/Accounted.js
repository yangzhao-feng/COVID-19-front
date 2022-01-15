$(function(){
    var cityList = [];
    var serialList = []

    var index = new Vue({
        el: "#content",
        data: {
            serverUrl:"http://101.35.156.227:20002",
            allConfirm:0
        },
        methods:{
            getInfo(){

                axios.get(this.serverUrl + '/home/AllConfirm')
                .then((response)=>{
                    if(response.data.status=="200"){
                        this.allConfirm = response.data.data;
                    }
                });

                axios.get(this.serverUrl + '/home/CityInfo')
                .then((response)=>{
                    if(response.data.status=="200")
                    {
                        data = response.data.data;
                        // console.log(data);
                        $.each(data,function(n,value){
                            if(value.confirm!=0)
                            {
                                var item = {};
                                //只考虑确诊的
                                item.name = value.province;
                                item.value = value.confirm;
                                cityList.push(value.province);
                                serialList.push(item);
                            }
                        });
                        console.log(cityList);
                        console.log(serialList);

                        var dom = document.getElementById("main");
                        var myChart = echarts.init(dom);
                        var app = {};

                        var option;

                        var data = genData(cityList,serialList);

                        //console.log(data);

                        option = {
                        title: {
                        text: '各省份确诊信息占比统计',
                        subtext: '确诊信息',
                        left: 'center'
                        },
                        tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                        },
                        legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: data.legendData,

                        selected: data.selected
                        },
                        series: [
                        {
                            name: '姓名',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: data.seriesData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                        ]
                        };


                        function genData(cityList,serialList) {
                            var legendData = cityList;
                            var seriesData = serialList;
                            // for (var i = 0; i < count; i++) {
                            // var name = Math.random() > 0.65
                            //     ? makeWord(4, 1) + '·' + makeWord(3, 0)
                            //     : makeWord(2, 1);
                            // legendData.push(name);
                            // seriesData.push({
                            //     name: name,
                            //     value: Math.round(Math.random() * 100000)
                            // });
                            // }

                            return {
                            legendData: legendData,
                            seriesData: seriesData
                            };

                            // function makeWord(max, min) {
                            // var nameLen = Math.ceil(Math.random() * max + min);
                            // var name = [];
                            // for (var i = 0; i < nameLen; i++) {
                            //     name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
                            // }
                            // return name.join('');
                            // }
                        }

                        if (option && typeof option === 'object') {
                        myChart.setOption(option);
                        }

                    }
                })
            }
        }
    });

    index.getInfo();


})

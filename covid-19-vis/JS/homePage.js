$(function () {

    var monthData = [];
    var labels = [];
    var confirmData = [];
    var cureData = [];
    var deathData = [];
    var index = new Vue({
        el: "#content",
        data: {
          confirm: 0,
          cure: 0,
          death: 0,
          confirmAdd:0,
          cureAdd:0,
          deathAdd:0,
          postive_confirm:true,
          negetive_confirm:false,
          postive_cure:true,
          negetive_cure:false,
          postive_death:true,
          negetive_death:false,
          serverUrl:"http://101.35.156.227:20002",
        },
        methods: {
          getInfo() {
            axios.defaults.withCredentials = true;
            // console.log(axios.defaults);
            axios.get(this.serverUrl + '/home/HomeInfo')
              .then((response) => {
                // console.log(response);
                if(response.data.status=="200")
                {
                  this.confirm = response.data.data.all_confirm;
                  this.cure = response.data.data.all_cure;
                  this.death = response.data.data.all_death;
                  this.confirmAdd = response.data.data.t_Y_confirm;
                  this.cureAdd = response.data.data.t_Y_cure;
                  this.deathAdd = response.data.data.t_Y_death;
                  if(this.confirmAdd>=0){this.postive_confirm = true;this.negetive_confirm = false;}
                  else if(this.confirmAdd<0){this.postive_confirm = false;this.negetive_confirm = true;}
                  if(this.cureAdd>=0){this.postive_cure = true;this.negetive_death = false;}
                  else if(this.cureAdd<0){this.postive_cure = false;this.negetive_cure = true;}
                  if(this.deathAdd>=0){this.postive_death = true;this.negetive_death = false;}
                  else if(this.deathAdd<0){this.postive_death = false;this.negetive_death = true;}
                }else{
                  alert("获取数据失败");
                }
              });

              axios.get(this.serverUrl + '/home/MonthInfo')
              .then((response) => {
                //console.log(response);
                if(response.data.status=="200")
                {
                    var dataList = [];
                    dataList = response.data.data;
                    if(dataList!=null&&dataList.length!=0)
                    {
                        $.each(dataList,function(n,value){
                            //初始化数据
                            var item={};
                            item.month = value.month;
                            item.confirmData = value.confirmData;
                            item.cureData = value.cureData;
                            item.deadData = value.deadData;
                            monthData.push(item);

                            //初始化图表数据
                            labels.push(value.month);
                            confirmData.push(value.confirmData);
                            cureData.push(value.cureData);
                            deathData.push(value.deadData);
                        });
                        //初始化图表
                        chartInit(labels,confirmData,cureData,deathData);
                    }
                }else{
                  alert("获取数据失败");
                }
              });
          },
          postRequest() {
          },
        }
      });

      index.getInfo();

      /*
    * Flot Interactive Chart
    * -----------------------
    */
    // We use an inline data source in the example, usually data would
    // be fetched from a server
    var data        = [],
    totalPoints = 100

    function getRandomData() {

        if (data.length > 0) {
            data = data.slice(1)
        }

        // Do a random walk
        while (data.length < totalPoints) {

            var prev = data.length > 0 ? data[data.length - 1] : 50,
                y    = prev + Math.random() * 10 - 5

            if (y < 0) {
            y = 0
            } else if (y > 100) {
            y = 100
            }

            data.push(y)
        }

        // Zip the generated y values with the x values
        var res = []
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]])
        }

        return res
    }


    var interactive_plot = $.plot('#interactive', [
        {
        data: getRandomData(),
        }
    ],
    {
        grid: {
        borderColor: '#f3f3f3',
        borderWidth: 1,
        tickColor: '#DCDCDC'
        },
        series: {
        color: '#3c8dbc',
        lines: {
            lineWidth: 2,
            show: true,
            fill: true,
        },
        },
        yaxis: {
        min: 0,
        max: 100,
        show: true
        },
        xaxis: {
        show: false
        }
    }
    )

    var updateInterval = 1000 //Fetch data ever x milliseconds
    var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching
    function update() {

    interactive_plot.setData([getRandomData()])

    // Since the axes don't change, we don't need to call plot.setupGrid()
    interactive_plot.draw()
    if (realtime === 'on') {
        setTimeout(update, updateInterval)
    }
    }

    //INITIALIZE REALTIME DATA FETCHING
    if (realtime === 'on') {
    update()
    }
    //REALTIME TOGGLE
    $('#realtime .btn').click(function () {
    if ($(this).data('toggle') === 'on') {
        realtime = 'on'
    }
    else {
        realtime = 'off'
    }
    update()
    })
    /*
    * END INTERACTIVE CHART
    */


})


//图表数据初始化
function chartInit(labels,confirmList,cureList,deathList)
{
    /* ChartJS
    * -------
    * Here we will create a few charts using ChartJS
    */

    //--------------
    //- AREA CHART -
    //--------------

    // Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $('#areaChart').get(0).getContext('2d')
    var areaChartData = {
        labels  : labels,
        datasets: [
        {
            label               : 'Cure',
            backgroundColor     : 'rgba(40,167,69,0.9)',
            borderColor         : 'rgba(40,167,69,0.8)',
            pointRadius          : false,
            pointColor          : '#3b8bba',
            pointStrokeColor    : 'rgba(60,141,188,1)',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data                : cureList
        },
        {
            label               : 'Confirmed',
            backgroundColor     : 'rgba(255,193,7, 1)',
            borderColor         : 'rgba(255,193,7, 1)',
            pointRadius         : false,
            pointColor          : 'rgba(210, 214, 222, 1)',
            pointStrokeColor    : '#c1c7d1',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data                : confirmList
        },
        {
            label               : 'Dead',
            backgroundColor     : 'rgba(220,53,69, 1)',
            borderColor         : 'rgba(220,53,69, 1)',
            pointRadius         : false,
            pointColor          : 'rgba(210, 214, 222, 1)',
            pointStrokeColor    : '#c1c7d1',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data                : deathList
        }
        ]
    }

    var areaChartOptions = {
        maintainAspectRatio : false,
        responsive : true,
        legend: {
        display: false
        },
        scales: {
        xAxes: [{
            gridLines : {
            display : false,
            }
        }],
        yAxes: [{
            gridLines : {
            display : false,
            }
        }]
        }
    }

    // This will get the first returned node in the jQuery collection.
    new Chart(areaChartCanvas, {
        type: 'line',
        data: areaChartData,
        options: areaChartOptions
    })

    //-------------
    //- BAR CHART -
    //-------------
    var barChartCanvas = $('#barChart').get(0).getContext('2d')
    var barChartData = $.extend(true, {}, areaChartData)
    var temp0 = areaChartData.datasets[0]
    var temp1 = areaChartData.datasets[1]
    barChartData.datasets[0] = temp1
    barChartData.datasets[1] = temp0

    var barChartOptions = {
        responsive              : true,
        maintainAspectRatio     : false,
        datasetFill             : false
    }

    new Chart(barChartCanvas, {
        type: 'bar',
        data: barChartData,
        options: barChartOptions
    })
}
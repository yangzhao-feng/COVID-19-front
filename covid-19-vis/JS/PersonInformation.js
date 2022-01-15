$(function()
{
    var index = new Vue({
        el: "#personInformation",
        data: {
          username: null,
          health: null,
          email:null,
          realname:null,
          riskArea:null,
          address:null,
          tabelHtml:null,
          tripList:[]
        },
        created() {
              this.init();
              this.initTable();
        },
        methods: {
          getCookie(cname)
            {
              var name = cname + "=";
              var ca = document.cookie.split(';');
              for(var i=0; i<ca.length; i++)
              {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length);
              }
              return "";
            },
          init() {
            //获取cookie中的值
            this.username = this.getCookie("username");
            this.email = this.getCookie("email");
            this.realname = this.getCookie("realname");

            var serverUrl = "http://101.35.156.227:20001";

            var returnUrl = this.returnUrl;
             // form提交
            axios.defaults.withCredentials = true;
                  // console.log(axios.defaults);
            axios.get(serverUrl + '/userInfo/Information?email='+this.email)
            .then((response) => {
            if(response.data.status=="200")
            {
              document.cookie="health="+response.data.data.health;
              document.cookie="riskArea="+response.data.data.riskAreas;
              document.cookie="address="+response.data.data.address;

            }else{
              alert("请求失败");
            }
            });

            var healthCode = this.getCookie("health");
            var riskAreaCode = this.getCookie("riskArea");

            this.address = this.getCookie("address");

            if(riskAreaCode == "3")
            {
              //高风险
              this.riskArea = "高风险";
            }else if(riskAreaCode == "2")
            {
              //中风险
              this.riskArea="中风险";
            }else if(riskAreaCode == "1")
            {
              //低风险
              this.riskArea ="低风险";
            }else if(riskAreaCode == "0")
            {
              //无风险
              this.riskArea ="无风险";
            }

            if(healthCode == "3")
            {
              //健康
              this.health = "健康";
            }else if(healthCode == "2")
            {
              //死亡
              this.health="死亡";
            }else if(healthCode == "1")
            {
              //确诊
              this.health ="确诊";
            }else if(healthCode == "0")
            {
              //治愈
              this.health ="治愈";
            }
          },
          initTable()
          {
            var serverUrl = "http://101.35.156.227:20001";

            var returnUrl = this.returnUrl;
            axios.get(serverUrl + '/userInfo/tripInfo?username='+this.username)
              .then((response) => {
                if(response.data.status=="200")
                {
								  var tripList = response.data;
                  this.tripList = JSON.parse(tripList);
                  alert(response.data);
                  alert(tripList.data[1].place);
                }else{
                  alert("请求失败");
                }
              });

            this.tabelHtml = "<tr><td>"+1+"</td><td>"+2+"</td><td>"+1+"</td><td>"+1+"</td><td>"+1+"</td></tr>";
          },
          postRequest() {
          }
        }
      });
})
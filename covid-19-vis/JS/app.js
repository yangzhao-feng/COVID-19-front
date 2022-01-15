window.app = {
    /* 开发环境 */
    // serverUrl: "http://localhost:8088",                                   // 接口服务接口地址
    // paymentServerUrl: "http://192.168.1.3:8089",                            // 支付中心服务地址
    // shopServerUrl: "http://localhost:8080/foodie-shop/",                  // 门户网站地址
    // centerServerUrl: "http://localhost:8080/foodie-center/",              // 用户中心地址
    // cookieDomain: "",                                                       // cookie 域

    /* 生产环境 */
    serverUrl: "http://api.z.mukewang.com:8088/foodie-dev-api",                      // 接口服务接口地址
    paymentServerUrl: "http://payment.t.mukewang.com/foodie-payment",       // 支付中心服务地址
    shopServerUrl: "http://shop.z.mukewang.com:8080/foodie-shop/",                            // 门户网站地址
    centerServerUrl: "http://center.z.mukewang.com:8080/foodie-center/",                        // 用户中心地址
    cookieDomain: "",                                       // cookie 域

    ctx: "/covid-19-vis",

    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            // console.log(c)
            while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1){
                    return c.substring(name.length, c.length);
                }
            }
        return "";
    },

    goErrorPage() {
        window.location.href = "http://www.imooc.com/error/noexists";
    },

    setCookie: function(name, value) {
        var Days = 365;
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        var cookieContent = name + "="+ encodeURIComponent (value) + ";path=/;";
        if (this.cookieDomain != null && this.cookieDomain != undefined && this.cookieDomain != '') {
            cookieContent += "domain=" + this.cookieDomain;
        }
        document.cookie = cookieContent;
        // document.cookie = name + "="+ encodeURIComponent (value) + ";path=/;domain=" + cookieDomain;//expires=" + exp.toGMTString();
        console.log(cookieContent);
    },

    deleteCookie: function(name) {
        var cookieContent = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (this.cookieDomain != null && this.cookieDomain != undefined && this.cookieDomain != '') {
            cookieContent += "domain=" + this.cookieDomain;
        }
        document.cookie = cookieContent;
    },

    getUrlParam(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");    //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);            //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null;             //返回参数值
    },

    checkMobile(mobile) {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            return false;
        }
        return true;
    },
}

# JSONP

- JSONP是json的一种“使用模式”，用于解决主流浏览器的跨域数据访问问题（规避[同源策略](../HTML及计算机网络/同源策略.md)）
- 用JSONP抓取到的资料不是json，而是任意Javascript
- 用Javascript直译器执行而不是用json解析器解析


   例如：
    
        //原生Js
        function jsonpcallback(json) { //回调函数
        console.log(json)
         }

         $("#getJsonpByHand").click(function () {
        CreateScript("http://localhost:2701/home/somejsonp?callback=jsonpcallback")//通过QueryString告知客户端回掉函数是哪个
         })
    
    
  例如：
   
        //jQuery
        $("#getJsonpByJquery").click(function () {
        $.ajax({
            url: 'http://localhost:2701/home/somejsonp',
            dataType: "jsonp",
            jsonp: "callback",
            success: function (data) {
                console.log(data)
            }
        })
    })
    
- `一句话就是利用script标签绕过同源策略，获得一个类似这样的数据，jsonpcallback是页面存在的回调方法，参数就是想得到的json。`
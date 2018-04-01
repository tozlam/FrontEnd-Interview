# Ajax

## XMLHttpRequest对象
- 将Ajax具象化，可以看出其就是无需刷新页面而可以从服务器端取得数据的一种技术，所以微软率先引入了XMLHttpRequest。
- Ajax技术的核心是XMLHttpRequest对象（XHR）。
- XHR向服务器发送请求和解析服务器响应提供了流畅的接口。能够以异步方式从服务器获得更多信息，意味着用户单击后，可以不必刷新页面也能够获得新数据。

### 创建XMLHttpRequest对象
````
 var xhr=new XMLHttpRequest();
````
### XHR用法
#### open()
- 在使用XHR对象时，要调用的第一个方法是open(),它接受三个参数：要接受的请求类型(get/post),请求的URL,是否异步发送请求的布尔值(true/false)。
````
xhr.open("get","example.php",false);
````
- 调用open()方法不会真的发送请求，而是启动一个请求以备发送。
#### send()
- 要发送特定的请求，必须调用send()方法。
````
xhr.open("get","example.php",false);
xhr.send(null);
````
- send()方法接受一个参数，即要作为请求主体发送的数据。
- 如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对于有些浏览器来说是必须的。
- 调用send()之后，请求就会被分派到服务器。
- 在收到响应后，响应的数据会自动填充XHR对象的属性，相关的属性如下：
  - responseText:作为响应主体被返回的文本
  - responseXML:如果响应的内容类型是"text/xml"或"application/xml",这个属性将保存包含响应数据的XML DOM文档
  - [status:响应的HTTP状态](../HTML/HTTP状态码.md)
  - statusText:HTTP状态的说明
- 在接收到响应后第一步是检查status属性，以确定响应是否已经成功返回。
#### readyState属性
- readyStats属性表示请求/响应过程的当前活动阶段。
    - value=0,open()方法还未被调用
    - value=1,send()方法还未被调用
    - value=2,send()方法已经被调用，响应头和响应状态已经返回
    - value=3,响应体下载中，responseText中已经获取了部分数据
    - value=4,请求完成，整个请求过程已经完毕。
- 只要readyState属性由一个值变成另一个值，都会触发一次readyStatechange事件。可以利用这个事件来检测每次状态变化后readyState的值。不过必须在调用open()之前指定onreadystatechange事件处理程序才能确保跨浏览器的兼容性。
````
var xhr=createXHR();
xhr.onreadystatechange = function() {
  if( (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ){
    alert("请求成功");
  }else{
    alert("请求失败");
  }
};
try{
  xhr.open("get","example.json",true);
  xhr.send(null);
}catch(err){
  console.log(err);
}
````
#### abort()
- 在接收到响应之前还可以调用abort()方法来取消异步请求。
````
xhr.abort();
````
- 调用这个方法之后，xhr对象会停止触发事件，而且再也不在允许访问任何与响应有关的对象属性。
### HTTP头部信息
- 每个HTTP请求和响应都会带有相应的头部信息，默认情况下，在发送XHR请求的同时，还会发送下列头部信息：
````
Accept:浏览器能够处理的内容类型
Accept-Charset:浏览器能够显示的字符集
Accept-Encoding:浏览器能够处理的压缩编码
Accept-Language:浏览器当前设置的语言
Connetcion:浏览器与服务器之间连接的类型
Cookie:当前页面设置的任何Cookie
Host:发出请求的页面所在的域
Referer:发出请求的页面的URL
User-Agent:浏览器的用户代理字符串
````
- 使用setRequestHeader()可以设置自定义的请求头部信息。这个方法接受两个参数:头部字段的名称和头部字段的值：
````
xhr.open("get","example.json",true);
xhr.setRequestHeader("Myheader","myvalue");
xhr.send(null);
````
- 如果调用XHR对象的getResponseHeader(key)之后，就能取得对应key的响应头部信息。
- 而getAllResponseHeaders()方法则可以取得一个包含所有头部信息的长字符串。


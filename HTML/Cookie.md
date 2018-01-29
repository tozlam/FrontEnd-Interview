# Cookie !!!
## cookie的工作流程
##### 基本通信流程：
 
    设置cookie -> cookie被自动添加到request header -> 服务端接收到cookie
 

##### cookie的工作流程：
  
  cookie是储存在浏览器中的纯文本，浏览器的安装目录下会专门有一个cookie在文件夹。<br>存储cookie是浏览器的功能
  
  当网页发一个http请求时，浏览器先检查是否有相应的cookie，有则自动添加在request header中的cookie字段中，这些是浏览器自动帮我们做的。
  存储在cookie中的数据，每次都会被自动放在http请求中。
  - 如果这些数据并不是每个请求都需要发给服务端的数据，浏览器的自动处理显然增加了开销。
  - 如果这些数据每个请求都要发给服务端，浏览器的自动处理就大大免去了重复操作。
  
  ##### cookie属性选项
  cookie选项有：expires、domain、path、secure、httponly
  <br>在设置任意一个cookie时都可以设置这些属性，也可以不设置；不设置则默认使用默认属性。属性之间由一个分号和一个空格隔开。
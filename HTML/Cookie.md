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
  
  ## cookie的属性选项
  `cookie选项有：expires、domain、path、secure、httponly`
  <br>在设置任意一个cookie时都可以设置这些属性，也可以不设置；不设置则默认使用默认属性。<br>属性之间由一个分号和一个空格隔开。
  
#### expires
- `expires设置了cookie的失效时间。`设置了expires，浏览器会把cookie保存在硬盘上。
- expires必须是GMT格式的日期（可通过new Date().toGMTString()或new Date().toUTCString()获得。

- 对于失效的cookie浏览器会清空。
- 如果没有设置该选项，则默认有效期为session，即会话cookie。这种cookie在浏览器关闭后就没有了。

- expires 是 http/1.0协议中的选项，在新的http/1.1协议中expires已经由 max-age 选项代替，
两者的作用都是限制cookie 的有效时间。expires的值是一个时间点（cookie失效时刻= expires），
而max-age 的值是一个以秒为单位时间段（cookie失效时刻= 创建时刻+ max-age）。

#### domain 和 path
- `domain选项用来设置cookie该发到哪个域名。`<br>

- `path选项用来设置cookie该发往哪个路径。`

    e.g:cookie 设置为domain=tozlam.cn; path=/pub; 
    表示：若请求的地址域名是tozlam.cn(或其子域如cat.tozlam.cn)，
    路径是“/pub”(或其下的任一子目录如/pub/example)时，浏览器才会将这个cookie自动添加到请求头部中。
    
  所以domain和path两个选项共同决定了cookie何时被浏览器自动添加到请求头部中发送出去。 如果没有设置这两个选项，则会使用默认值。`domain的默认值为设置该cookie的网页所在的域名，path默认值为设置该cookie的网页所在的目录。`
  
  #### secure 
- `secure用来设置cookie只在确保安全的请求中才会发送`
  
- 当请求是https或其他安全协议时，包含secure选项的cookie才能被发送到服务器。
- 默认cookie不会带secure选项，所以默认https/http协议的请求，cookie都会发送服务器。
- 但secure选项只是限定了在安全情况下才可以传输给服务器，但不代表看不到cookie。

- 如果想在网页中通过js去设置secure类型的cookie，必须保证网页是https协议的。


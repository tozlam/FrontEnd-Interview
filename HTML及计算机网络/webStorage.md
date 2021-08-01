# webStorage

- `两个接口：localStorage、sessionStorage`
- `四个函数：setItem、getItem、removeItem、clear`

####  localStorage
-  域内安全、永久保存。即客户端或浏览器中来自同一域名的所有页面都可访问localStorage数据且数据除了删除否则永久保存，但客户端或浏览器之间的数据相互独立。
- 四个函数：
    
        1.localStorage.setItem(key,value)       //存储数据信息到本地
        2.localStorage.getItem(key)            //读取本地存储的信息
        3.localStorage.removeItem(key)        //删除本地存储的信息
        4.localStorage.clear()               //清空所有存储的信息
        
#### sessionStorage
- 会话控制、短期保存。会话概念与服务器端的session概念相似，短期保存指窗口或浏览器或客户端关闭后自动消除数据。
- 四个函数：

        1.sessionStorage.setItem(key,value)       //存储数据信息到本地
        2.sessionStorage.getItem(key)            //读取本地存储的信息
        3.sessionStorage.removeItem(key)        //删除本地存储的信息
        4.sessionStorage.clear()               //清空所有存储的信息

+ cookies，sessionStorage 和 localStorage 的区别
````
cookie是网站为了标示用户身份而储存在用户本地终端（Client Side）上的数据（通常经过加密）

cookie数据始终在同源的http请求中携带（即使不需要），记会在浏览器和服务器间来回传递

sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存

存储大小：
cookie数据大小不能超过4k
sessionStorage和localStorage虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大

有期时间：
localStorage 存储持久数据，浏览器关闭后数据不丢失除非主动删除数据
sessionStorage 数据在当前浏览器窗口关闭后自动删除
cookie 设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭
````
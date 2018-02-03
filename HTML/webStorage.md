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
        
  
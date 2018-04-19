# Expires & Cache-control
##概念
- ### Cache-control 
用于控制HTTP缓存（在HTTP/1.0中可能部分没实现，仅仅实现了 Pragma: no-cache）
- ### Expires 
表示存在时间，允许客户端在这个时间之前不去检查（发请求），等同Cache-control中max-age的效果。
- 如果同时存在，则被Cache-Control的max-age覆盖。

## 格式
### Cache-control: 
数据包中的格式：

Cache-Control: cache-directive

cache-directive可以为以下：

request时用到：
````
| "no-cache"
| "no-store"
| "max-age" "=" delta-seconds
| "max-stale" [ "=" delta-seconds ]
| "min-fresh" "=" delta-seconds
| "no-transform"
| "only-if-cached"
| "cache-extension"
````
response时用到：
````
| "public"
| "private" [ "=" <"> field-name <"> ]
| "no-cache" [ "=" <"> field-name <"> ]
| "no-store"
| "no-transform"
| "must-revalidate"
| "proxy-revalidate"
| "max-age" "=" delta-seconds
| "s-maxage" "=" delta-seconds
| "cache-extension"
````
部分说明：
````
根据是否可缓存分为
Public 指示响应可被任何缓存区缓存。
Private 指示对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效。
no-cache 指示请求或响应消息不能缓存（HTTP/1.0用Pragma的no-cache替换）
根据什么能被缓存
no-store 用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存。
根据缓存超时
max-age 指示客户机可以接收生存期不大于指定时间（以秒为单位）的响应。
min-fresh 指示客户机可以接收响应时间小于当前时间加上指定时间的响应。
max-stale 指示客户机可以接收超出超时期间的响应消息。如果指定max-stale消息的值，那么客户机可以接收超出超时期指定值之内的响应消息。
````
### Expires
数据包中的格式：<br>
Expires = "Expires" ":" HTTP-date <br>
例如<br>
Expires: Thu, 01 Dec 1994 16:00:00 GMT （必须是GMT格式）

## 应用
通过HTTP的META设置expires和cache-control

- < meta http-equiv = "Cache-Control" content = "max-age=7200" />
- < meta http-equiv = "Expires" content = "Mon, 20 Jul 2009 23:00:00 GMT" />
上述设置仅为举例，实际使用其一即可。这样写的话仅对该网页有效，对网页中的图片或其他请求无效，并不会做任何cache。

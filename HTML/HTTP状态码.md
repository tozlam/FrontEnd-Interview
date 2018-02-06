# HTTP状态码


    状态码的职责是当客户端向服务器端发送请求时，描述返回请求结果。
    借助状态码，用户可以知道服务器端是正常处理了请求，还是出现了什么错误。

RFC2616 定义的状态码，由 3 位数字和原因短信组成。
数字中的第一位指定了响应类别，后两位无分类。响应类别有以下 5 种：
    
    Type	   Reason-phrase	    Note
    1XX	    Informational	    信息性状态码，表示接受的请求正在处理
    2XX	    Success	            成功状态码，表示请求正常处理完毕
    3XX	    Redirection	           重定向状态码，表示需要客户端需要进行附加操作
    4XX	    Client Error	    客户端错误状态码，表示服务器无法处理请求
    5XX	    Server Error	    服务器错误状态码，表示服务器处理请求出错
    
RFC2616 记录的 HTTP 状态码有 37 种，再加上「WebDAV」(RFC4918、5842)和
「Additional HTTP Status Codes」(RFC6585)，数量就达到 60 多种。

## 常用的状态码

##2XX Success

    This class of status code indicates that the client’s request was successfully received, 
    understood, and accepted.
    
    2xx 响应结果表示从客户端发来的请求在服务器端被正常处理了。

#### 200 OK

    请求被成功处理，服务器会根据不同的请求方法返回结果：
    GET：请求的对应资源会作为响应返回。
    HEAD：请求的对应资源的响应头(entity-header)会作为响应返回,不包括响应体(message-body)。
    POST：返回处理对应请求的结果。

#### 204 No Content

    该状态码表示服务器接收到的请求已经处理完毕，但是服务器不需要返回响应体.
    比如，客户端是浏览器的话，发出的请求返回 204 响应，那么浏览器显示的页面不会发生更新。

#### 206 Partial Content

    该状态码表示客户端进行了范围请求，而服务器成功执行了这部分的 GET 请求。
    客户端发起的请求，必须在请求头中包含Range字段。
    服务端响应报文中，必须包含由Content-Range指定范围的实体内容(entity-bodies )

## 3XX Redirection

    This class of status code indicates that further action needs to be taken by 
    the user agent in order to fulfill the request.
    
    3XX 响应结果表明浏览器需要执行某些特殊的处理以完成请求。

#### 301 Movied Permanently

    永久性重定向。
    该状态码表示请求的资源已经被分配了新的URI，并且以后使用资源现在所指的URI。
    
    并且根据请求的方法有不同的处理方式：
    HEAD：必须在响应头部Location字段中指明新的永久性的URI。
    GET：除了有Location字段以外，还需要在响应体中附上永久性URI的超链接文本。
    POST：客户端在发送POST请求，受到301响应之后，不应该自动跳转URI，应当让用户确认跳转。
    
    比如，如果一个URI已经在浏览器中被收藏为书签，这时应该按照Location首部字段提示的 URI 重新保存。
    例如建立一个收藏的书签：
    http://wan.bigertech.com
    
    当访问这个书签的时候，请求会被重定向到
    http://wan.meizu.com
    并且对应的书签会被改变，指向http://wan.meizu.com
    
    不信？Try yourself.

#### 302 Found

    临时性重定向。
    该状态码表示请求的资源已被分配了新的URI，希望用户本次能使用新的URI访问。
    和 301 Moved Permanently 状态码相似，但 302 状态码代表的资源不是被永久移动，只是临时性质的。
    如果，用户把一个 URI 收藏为书签，302 响应是不会像 301 那样去更新书签。

#### 303 See Other

    该状态码表示由于请求对应的资源存在另一个URI，应使用GET方法定向获取请求的资源。
    303与302不同之处在于，302是不会改变请求的方法，如果请求方法是POST的话，重定向的请求也应该是POST。
    而对于303，使用POST请求的话，重定向的请求应该是GET请求。
    
    但是有一点是需要注意的，许多 HTTP/1.1 版以前的浏览器不能正确理解 303 状态码，
    很多现存的浏览器讲 302 响应视为 303 响应，并且使用 GET 方式访问Location中规定的的 URI，而无视原先请求的方法。
    
    在 RFC2616 中有相关的这样一段原文：
    Note: Many pre-HTTP/1.1 user agents do not understand the 303 status. 
    When interoperability with such clients is a concern, the 302 status code may be used instead, 
    since most user agents react to a 302 response as described here for 303.

#### 304 Not Modified

    该状态码表示客户端发送附带条件请求时，服务器端允许请求访问资源，但未满足条件的情况。
    304 状态码返回时，不包含任何响应的主题部分。
    附带条件的请求指的是采用GET方法的请求头中包含：If-Match、If-Modified-Since、If-None-Match、
    If-Range、If-Unmodified-Since中任一首部。

#### 307 Temporary Redirect

    临时重定向。
    该状态码与 302 和 303 的有着类似的含义，不同之处在于，
    307 状态码并不会指定客户端要用什么样的请求方法请求重定向地址。
    (302 指定使用原有请求方法，303 指定使用 GET 方法)

## 4XX Client Error

    The 4xx class of status code is intended for cases in which the client seems to have erred.
    4XX 的响应结果表明客户端是发生错误的原因所在

#### 400 Bad Request
    
    表示该请求报文中存在语法错误，导致服务器无法理解该请求。
    客户端需要修改请求的内容后再次发送请求。

#### 401 Unauthorized

    该状态码表示发送的请求需要有通过HTTP认证(Basic认证，Digest认证)的认证信息。
    返回含有401的响应，必须在头部包含WWW-Authenticate以指明服务器需要哪种方式的认证。
    
    当客户端再次请求该资源的时候，需要在请求头中的Authorization包含认证信息。

#### 403 Forbidden

    该状态码表明对请求资源的访问被服务器拒绝了。
    服务器没有必要给出拒绝的详细理由，但如果想做说明的话，可以在实体的主体部分原因进行描述，这样就能让用户看到了。
    
    未获得文件系统的访问权限，访问权限出现某些问题，从未授权的发送源 IP 地址试图访问等情况都可能发生 403 响应。

#### 404 Not Found

    该状态码表明服务器上无法找到指定的资源。通常被用于服务器不想透露拒绝请求的原因，或者没有其他的响应可提供。

## 5XX Server Error

    Response status codes beginning with the digit “5” indicate cases in which the server
     is aware that it has erred or is incapable of performing the request.
    
    5XX 的响应结果表明服务器本身发生错误，或者没有足够的能力来处理请求。

#### 500 Internal Server Error

    该状态码表明服务器端在执行请求时发生了错误。
    也有可能是 Web 应用存在的 BUG 或某些临时的故障。

#### 503 Service Unavailable

    该状态码表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。
    如果事先得知解除以上需要的时间，最好写入Retry-After首部字段再返回给客户端。

## 讲讲304缓存的原理

    服务器首先产生ETag，服务器可在稍后使用它来判断页面是否已经被修改。
    本质上，客户端通过将该记号传回服务器要求服务器验证其（客户端）缓存。
    
    304是HTTP状态码，服务器用来标识这个文件没修改，不返回内容，浏览器在接收到个状态码后，
    会使用浏览器已缓存的文件客户端请求一个页面（A）。 服务器返回页面A，并在给A加上一个ETag。
     
    客户端展现该页面，并将页面连同ETag一起缓存。 
    客户再次请求页面A，并将上次请求时服务器返回的ETag一起传递给服务器。 
    
    服务器检查该ETag，并判断出该页面自上次客户端请求之后还未被修改，
    直接返回响应304（未修改——Not Modified）和一个空的响应体。
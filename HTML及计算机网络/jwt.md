# Json Web Token

### 组成
1. JWT由三个部分组成：header，payload，signature

##### header部分：
````
{
  "alg": "HS256",
  "typ": "JWT"
}
````
对应base64UrlEncode编码为：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

说明：该字段为json格式。alg字段指定了生成signature的算法，默认值为 HS256，typ默认值为JWT

##### payload部分：
载荷就是存放有效信息的地方。这个名字像是特指飞机上承载的货品，这些有效信息包含三个部分

1. 标准中注册的声明
    1. iss: jwt签发者
    2. sub: jwt所面向的用户
    3. aud: 接收jwt的一方
    4. exp: jwt的过期时间，这个过期时间必须要大于签发时间
    5. nbf: 定义在什么时间之前，该jwt都是不可用的.
    6. iat: jwt的签发时间
    7. jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。

2. 公共的声明
    公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密.
3. 私有的声明
    私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为base64是对称解密的，意味着该部分信息可以归类为明文信息。
````
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
````
对应base64UrlEncode编码为：eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

说明：该字段为json格式，表明用户身份的数据，可以自己自定义字段，很灵活。sub 面向的用户，name 姓名 ,iat 签发时间。例如可自定义示例如下：
````
{
    "iss": "admin",          //该JWT的签发者
    "iat": 1535967430,        //签发时间
    "exp": 1535974630,        //过期时间
    "nbf": 1535967430,         //该时间之前不接收处理该Token
    "sub": "www.admin.com",   //面向的用户
    "jti": "9f10e796726e332cec401c569969e13e"   //该Token唯一标识
}
````
##### signature部分：
这个签证信息由三部分组成：
1. header (base64后的)
2. payload (base64后的)
3. secret
````
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  123456
)
````
对应的签名为：keH6T3x1z7mmhKL1T3r9sQdAxxdzB6siemGMr_6ZOwU

最终得到的JWT的Token为(header.payload.signature)：
````
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.keH6T3x1z7mmhKL1T3r9sQdAxxdzB6siemGMr_6ZOwU
````
说明：对header和payload进行base64UrlEncode编码后进行拼接。通过key（这里是123456）进行HS256算法签名。

### 使用流程
初次登录：用户初次登录，输入用户名密码

密码验证：服务器从数据库取出用户名和密码进行验证

生成JWT：服务器端验证通过，根据从数据库返回的信息，以及预设规则，生成JWT

返还JWT：服务器的HTTP RESPONSE中将JWT返还

带JWT的请求：以后客户端发起请求，HTTP REQUEST

HEADER中的Authorizatio字段都要有值，为JWT

服务器验证JWT

注： 这个token必须要在每次请求时传递给服务端，它应该保存在请求头里， 另外，服务端要支持CORS(跨来源资源共享)策略，一般我们在服务端这么做就可以了Access-Control-Allow-Origin: *。

### JWT与Session的区别
相同点是，它们都是存储用户信息； Session 在服务器端, JWT 在客户端

Session方式存储用户信息的最大问题在于要占用大量服务器内存，增加服务器的开销。

JWT方式将用户状态分散到了客户端中，可以明显减轻服务端的内存压力

### JWT总结
JWT默认不加密，但可以加密。生成原始令牌后，可以使用改令牌再次对其进行加密。

当JWT未加密方法是，一些私密数据无法通过JWT传输。

JWT不仅可用于认证，还可用于信息交换。（善用JWT有助于减少服务器请求数据库的次数。）

JWT的最大缺点是服务器不保存会话状态，所以在使用期间不可能取消令牌或更改令牌的权限。也就是说，一旦JWT签发，在有效期内将会一直有效。

JWT本身包含认证信息，因此一旦信息泄露，任何人都可以获得令牌的所有权限。为了减少盗用，JWT的有效期不宜设置太长。对于某些重要操作，用户在使用时应该每次都进行进行身份验证。

为了减少盗用和窃取，JWT不建议使用HTTP协议来传输代码，而是使用加密的HTTPS协议进行传输。
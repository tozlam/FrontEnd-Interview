# W3C标准
1. 定义语言编码
````
<meta http-equiv=“Content-Type” content=“text/html; charset=gb2312” />
````  
为了被浏览器正确解释和通过W3C代码校验，所有的XHTML文档都必须声明它们所使用的编码语言，我们一般使用gb2312(简体中文)，制作多国语言页面也有可能用Unicode、ISO-8859-1等，根据你的需要定义。

2. Javascript定义

Js必须要用`<script language="javascript" type="text/javascript">`来开头定义，而不是原来的`<script language=javascript>`或干脆直接`<script>`，并且需要加个注释符<!--   -->，以保证不在不支持js的浏览器上直接显示出代码来。

3. CSS定义
   CSS必须要用`<style type=“text/css”>`开头来定义，而不是原来的直接`<style>`，也不建议直接写在内容代码里如：`<div style=”padding-left:20px;”></div>`，并需要加个注释符`<!-- -->` 。<br>
   为保证各浏览器的兼容性，在写CSS时请都写上数量单位。<br>
   例如：<br>
   - 错误：.space_10{padding-left:10} 
   - 正确：.space_10 {padding-left:10px}
4. 不要在注释内容中使用“--”
“--”只能发生在XHTML注释的开头和结束，也就是说，在内容中它们不再有效。
例如下面的代码是无效的：`<!--这里是注释-----------这里是注释-->`
正确的应用等号或者空格替换内部的虚线。`<!--这里是注释============这里是注释-->`

5. 所有标签的元素和属性的名字都必须使用小写
   与HTML不一样，XHTML对大小写是敏感的，`<title>`和`<TITLE>`是不同的标签。XHTML要求所有的标签和属性的名字都必须使用小写。例如：`<BODY>`必须写成`<body>`。大小写夹杂也是不被认可的，通常dreamweaver自动生成的属性名字"onMouseOver"也必须修改成"onmouseover"。

6. 所有的属性必须用引号""括起来
   在HTML中，你可以不需要给属性值加引号，但是在XHTML中，它们必须被加引号。<br>
   例如：`<height=80>`必须修改为：`<height="80">`。<br>
   特殊情况，你需要在属性值里使用双引号，你可以用"，单引号可以使用&apos;，例如：`<alt="say&apos;hello&apos;">`

7. 把所有<和&特殊符号用编码表示

   - 任何小于号（<），不是标签的一部分，都必须被编码为 &lt;
   - 任何大于号（>），不是标签的一部分，都必须被编码为 &gt;
   - 任何与号（&），不是实体的一部分的，都必须被编码为 &amp; 
8. 给所有属性赋一个值

XHTML规定所有属性都必须有一个值，没有值的就重复本身。<br>
例如： <br>
`<td nowrap><input type="checkbox" name="shirt" value="medium" checked>`必须修改为：
`<td nowrap="nowrap"><input type="checkbox" name="shirt" value="medium" checked="checked" />`

9. 所有的标记都必须要有一个相应的结束标记

   以前在HTML中，你可以打开许多标签，例如`<p>`和`<li>`而不一定写对应的`</p>`和`</li>`来关闭它们。但在XHTML中这是不合法的。XHTML要求有严谨的结构，所有标签必须关闭。如果是单独不成对的标签，在标签最后加一个"/"来关闭它。 <br>
   例如：<br>
  -  `<br />` 
  - `<img height="80" alt="网页" title=”网页” src="logo.gif" width="200" />`
   
10. 所有的标记都必须合理嵌套 
    同样因为XHTML要求有严谨的结构，因此所有的嵌套都必须按顺序，以前我们这样写的代码： 
    `<p><b></p></b>必须修改为：<p><b></b></p> `
    就是说，一层一层的嵌套必须是严格对称。

11. 图片添加有意义的alt属性
    例如：`<img src="logo.gif" width="100" height="100" align="middle" boder="0" alt="w3cschool" />`
    尽可能的让作为内容的图片都带有属于自己的alt属性。
    同理：添加文字链接的title属性。
    `<a href="#" target="_blank" title="新闻新闻新闻新闻">新闻新闻…</a>`，在一些限定字数的内容展示尤为重要，帮助显示不完成的内容显示完整，而不用考虑页面会因此而撑大。
 
 12. 在form表单中增加lable，以增加用户友好度<br>
  
     例如：
     ````
     <form action="http://somesite.com/prog/adduser" method="post">
       <label for="firstname">first name: </label>
       <input type="text" id="firstname" />
       <label for="lastname">last name: </label>
       <input type="text" id="lastname" />
     </form>
     ````
     
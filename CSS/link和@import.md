# link和@import的区别

link引用的HTML/XML

     <link rel="stylesheet"  type="text/css" href="21.css">
     
import引用的HTML/XML

     <style type="text/css">
     @import url("21.css");
     </style>

两者都是外部引用CSS的方式，但是存在一定的区别： 

- 区别1： link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务； <br>@import 属于 CSS 范畴，只能加载 CSS 。 
- 区别2： link 引用 CSS 时，在页面载入时同时加载；<br> @import 需要页面网页完全载入以后加载。 
- 区别3： link 是 XHTML 标签，无兼容问题； <br>@import 是在 CSS2.1 提出的，低版本的浏览器不支持。 
- 区别4： link 支持使用 Javascript 控制 DOM 去改变样式；<br>而 @import 不支持。 
# RegExp

<table>
<tr>
<th>字符</th>
<th>描述</th>
</tr>
<tr>
<td>\d</td>
<td>匹配一个数字</td>
</tr>
<tr>
<td>\D</td>
<td>匹配任何一个非数字</td>
</tr>
<tr>
<td>\w</td>
<td>匹配一个数字/字母</td>
</tr>
<tr>
<td>\W</td>
<td>匹配任何一个非数字/字母</td>
</tr>
<tr>
<td>\s</td>
<td>匹配任何一个空白字符，包括空格、制表符、换页符等等</td>
</tr>
<tr>
<td>\S</td>
<td>匹配任何一个非空白字符</td>
</tr>
<tr>
<td>\n</td>
<td>匹配一个换行符</td>
</tr>
<tr>
<td>\r</td>
<td>匹配一个回车符</td>
</tr>
<tr>
<td>\f</td>
<td>匹配一个换页符</td>
</tr>
<tr>
     <td>·</td>
     <td>任意匹配字符</td>
</tr>
<tr>
<td>*</td>
 <td>表示0-n个字符</td>
</tr>
<tr>
     <td>+</td>
     <td>至少一个字符（1-n）</td>
</tr>
<tr>
     <td>？</td>
     <td>表示0或1个字符</td>
</tr>
<tr>
     <td>{n}</td>
     <td>表示n个字符</td>
</tr>
<tr>
     <td>{n，}</td>
     <td>至少n个字符</td>
</tr>
<tr>
     <td>{n，m}</td>
     <td>表示n-m个字符</td>
</tr>
<tr>
     <td>A|B</td>
     <td>匹配A或B</td>
</tr>
<tr>
     <td>^</td>
     <td>表示行的开头</td>
</tr>
<tr>
     <td>$</td>
     <td>表示行的结束</td>
</tr>
<tr>
     <td>[abc]</td>
     <td>a或b或c</td>
</tr>

## 用法

- Js两种方法创建正则表达式：
   1.var re1=/ABC\-001/;                    //ABC/-001
   2.var re2=new RegExp("ABC\\-001");       //ABC/-001
   
- RegExp对象的test()方法用于测试给定的字符串是否符合条件

## 用途
- 切分字符串
    
      str.split(/[\s]+/);
- 分组
    
    例：
          
          var re=/^(\d{3})-(\d{3,8})$/;     //分别定义了两个组
          re.exec('010-12345');             //["010-123456","010","12345"]
    exec()方法匹配后，会返回一个Array，第一个元素是匹配成功的整个字符串，后面是匹配成功的子串，匹配失败会返回null。
    
- 全局搜索
            
         var re1=/RegExp/g;
         var re2=new RegExp("RegExp","g");
    - 指定g后，每次运行exec(),正则表达式本身会更新lastIndex属性，表示上次匹配到的最后索引。
    
    - 全局匹配不可使用/^...$/,那样只会最多匹配一次。
    - 正则表达式还可以用i标志表示忽略大小写，m标志表示执行多行匹配。  
# export/import
- ES6模块主要有两个功能：export和import
    - export用于对外输出本模块（一个文件可以理解为一个模块）变量的接口
    - import用于在一个模块中加载另一个含有export接口的模块。
- 也就是说使用export命令定义了模块的对外接口以后，其他JS文件就可以通过import命令加载这个模块（文件）。

````
import { name } from "/.a.js" //路径根据你的实际情况填写

````
````
export default {
  data () {
    return { }
  },
  created:function(){
    alert(name)//可以弹出来“李四”
  }
 }
 ````

- 上面的例子是导出单个变量的写法，如果是导出多个变量就应该按照下边的方法，用大括号包裹着需要导出的变量：
````
 var name1="李四";
 var name2="张三";
 export { name1 ,name2 }
 ````
- 在其他文件里引用如下：

````
import { name1 , name2 } from "/.a.js" //路径根据你的实际情况填写
````
````
export default {
  data () {
    return { }
  },
  created:function(){
    alert(name1)//可以弹出来“李四”
    alert(name2)//可以弹出来“张三”
  }
 }
 ````
- 如果导出的是个函数呢，那应该怎么用呢,其实一样，如下
````
function add(x,y){
   alert(x*y)
  //  想一想如果这里是个返回值比如： return x-y，下边的函数怎么引用
}
export { add }

````

- 在其他文件里引用如下：

````
import { add } from "/.a.js" //路径根据你的实际情况填写

````
````
export default {
  data () {
    return { }
  },
  created:function(){
   add(4,6) //弹出来24
  }
 }

````

### export与export default
- 区别如下：
    1. export与export default均可用于导出常量、函数、文件、模块等
    2. 你可以在其它文件或模块中通过import+(常量 | 函数 | 文件 | 模块)名的方式，将其导入，以便能够对其进行使用
    3. 在一个文件或模块中，export、import可以有多个，export default仅有一个
    4. 通过export方式导出，在导入时要加{ }，export default则不需要

- 这样来说其实很多时候export与export default可以实现同样的目的，只是用法有些区别。注意第四条，通过export方式导出，在导入时要加{ }，export default则不需要。使用export default命令，为模块指定默认输出，这样就不需要知道所要加载模块的变量名。

````
var name="李四";
export { name }
//import { name } from "/.a.js" 
可以写成：
var name="李四";
export default name
//import name from "/.a.js" 这里name不需要大括号
````
 


````
var name1="李四";
var name2="张三";
export { name1 ,name2 }
 ````

也可以写成如下，也是可以的，import跟他类似。
````
 var name1="李四";
 var name2="张三";
 export name1;
 export name2;
 ````
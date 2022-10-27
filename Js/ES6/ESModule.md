
+ 浏览器中ES Module是异步加载，不会堵塞浏览器，即等到整个页面渲染完，再执行模块脚本。如果网页有多个ESM，它们会按照在页面出现的顺序依次执行。

+ ES Module执行分为三个阶段：构造阶段、实例化阶段、求值阶段
````
构造阶段:
1、根据入口, 通过import代码去寻找与之关联的其他模块，形成一个依赖关系树(AST);
2、下载module文件，用于解析；
3、解析每个module文件，生成 Module Record（包含当前module的AST、变量等）；
4、将Module Record 映射到 Module Map中，保持每个module文件的唯一性；
构造阶段最后生成根据依赖关系AST的 Module Record的依赖树，同时将每个Module Record映射保存到Module Map中。

实例化阶段：
1、生成模每个Module Record的块环境记录(Module Enviroment Record)，用来管理 Module Record 的变量等；
2、在内存中写入每个Module的数据，同时 Module文件的导出export和引用文件的 import指向该地址；
实例化阶段确定了 export和import内存中的指向，同时该内存空间中定义了Module文件的变量（但是还未赋值）；

求值阶段：
1、执行对应Module文件中顶层作用域的代码，确定实例化阶段中定义变量的值，放入内存中；
求值阶段确定了Module文件中变量的值，由于 ES Module使用的是动态绑定（指向内存地址），export中修改数据会映射到内存中，import数据相应也会改变。

````
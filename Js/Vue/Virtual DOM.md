# Virtual DOM

### 是什么
一个能代表dom树的对象，通常含有标签名，标签上的属性，事件监听和子元素们，以及其他属性

### 优点
1. 减少DOM操作
    1. 虚拟dom可以将多次操作合并为一次操作（比如:添加1000个节点，却是一个个操作的）
    2. 借助dom diff可以把多余的操作省掉（比如：添加1000个节点，其实只有10个是新增的）
2. 跨平台渲染
    虚拟dom不仅可以变成dom，还可以变成小程序、ios应用、安卓应用，因为虚拟dom本质上是一个js对象

### 缺点
需要额外的创建函数，如createElement或h（可以通过vue-loader转义）

### DOM diff
+ 就是一个函数，我们称之为patch
+ patches = patch(oldNode, newNode)
+ patches就是要运行的dom操作，可能长这样
````
[
    {type: 'INSERT', vnode: ...},
    {type: 'TEXT', vnode: ...},
    {type: 'PROPS', propsPatch: [...]}
]
````
+ dom diff可能的大概逻辑：
 + Tree diff：
    - 将新旧两棵树逐层对比，找出哪些节点需要更新
    - 如果节点是组件就看Component diff
    - 如果节点是标签就看Element diff
 + Component diff
    - 如果节点是组件就先看组件类型
    - 类型不同直接替换（删除旧的）
    - 类型相同则只更新属性
    - 然后深入组件做Tree diff（递归）
 + Element diff
    - 如果节点是原生标签则看标签名
    - 标签名不同则直接替换，相同则只跟新属性
    - 然后深入标签做Tree diff（递归）
    
+ dom diff的bug：
    - 就是vue中v-for不加key或者key是index的bug
    ````
    数组[1,2,3] 如果我们要删除2（即数组中的第二个）时，vue会做两件事 ：把2变成了3 然后把3删除了 所以不加key的话vue删除的是数组中的第三个
    
    解决方法就是加key，这样vue就知道你真正要删除的是哪个元素
    ````
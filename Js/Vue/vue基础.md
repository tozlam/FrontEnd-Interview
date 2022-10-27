+ vue是什么
````
vue是一门渐进式的javascript框架。所谓的渐进式就是：从中心的的视图层渲染开始向外扩散的构建工具层。这过程会经历：视图层渲染->组件机制->路由机制->状态管理->构建工具；五个层级。
````

+ 为什么要加key（key有什么用）
````
key 是给每一个 vnode 的唯一 id,依靠 key,我们的 diff 操作可以更准确（可以让vue能够识别每一组节点）
更准确 : 因为带 key 就不是就地复用了,在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确,如果不加 key,会导致之前节点的状态被保留下来,会产生一系列的 bug。

【三胞胎战成一排，你怎么知道谁是老大？

如果老大皮了一下子，和老三换了一下位置，你又如何区分出来？

给他们挂个牌牌，写上老大、老二、老三。

这样就不会认错了。key就是这个作用。】

- 从vdom的diff算法角度：
    当页面的数据发生变化时，Diff算法只会比较同一层级的节点：如果节点类型不同，直接干掉前面的节点，再创建并插入新的节点，不会再比较这个节点以后的子节点了。如果节点类型相同，则会重新设置该节点的属性，从而实现节点的更新。当某一层有很多相同的节点时，也就是列表节点时，Diff算法的更新过程默认情况下也是遵循以上原则。
    比如一下这个情况：<img src="https://pic1.zhimg.com/50/v2-6e88cc53a7e427f0ae8340cf930ac30d_hd.jpg?source=1940ef5c" data-rawwidth="477" data-rawheight="191" class="origin_image zh-lightbox-thumb" width="477" data-original="https://pic2.zhimg.com/v2-6e88cc53a7e427f0ae8340cf930ac30d_r.jpg?source=1940ef5c"/>
    我们希望可以在B和C之间加一个F，Diff算法默认执行起来是这样的：<img src="https://pic3.zhimg.com/50/v2-bf76311258f100b789226ccbb2600071_hd.jpg?source=1940ef5c" data-rawwidth="572" data-rawheight="215" class="origin_image zh-lightbox-thumb" width="572" data-original="https://pic3.zhimg.com/v2-bf76311258f100b789226ccbb2600071_r.jpg?source=1940ef5c"/>即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？
    所以我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。<img src="https://pic4.zhimg.com/50/v2-bb1147af7c458f0b09d6a3c2f74b0100_hd.jpg?source=1940ef5c" data-rawwidth="452" data-rawheight="130" class="origin_image zh-lightbox-thumb" width="452" data-original="https://pic2.zhimg.com/v2-bb1147af7c458f0b09d6a3c2f74b0100_r.jpg?source=1940ef5c"/>所以一句话，key的作用主要是为了高效的更新虚拟DOM。另外vue中在使用相同标签名元素的过渡切换时，也会使用到key属性，其目的也是为了让vue可以区分它们，否则vue只会替换其内部属性而不会触发过渡效果。
 
- 从删除数组内元素时可能会出现bug角度：
    数组[1,2,3] 如果我们要删除2（即数组中的第二个）时，vue会做两件事 ：把2变成了3 然后把3删除了 所以不加key的话vue删除的是数组中的第三个
    
    解决方法就是加key，这样vue就知道你真正要删除的是哪个元素
````

+ v-for 与 v-if 一同使用
````
 当它们处于同一节点，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。
````

+ v-if v-show
````
    - v-if 判断结构是否加载的一个指令（有比较大的切换开销）
      v-if显示隐藏是将dom元素整个添加或删除；v-if切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；
      v-if是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。只有渲染条件为假时，并不做操作，直到为真才渲染
      v-if由false变为true的时候，触发组件的beforeCreate、create、beforeMount、mounted钩子，由true变为false的时候触发组件的beforeDestory、destoryed方法
      
    - v-show 判断结构是否显示的一个指令（有比较大的初始加载开销）
      v-show隐藏则是为该元素添加css--display:none，dom元素依旧还在。
      v-show 由false变为true的时候不会触发组件的生命周期
      
````

+ Vue 组件间通信有哪几种方式？
````
  （1）props / $emit  适用 父子组件通信
  这种方法是 Vue 组件的基础，相信大部分同学耳闻能详，所以此处就不举例展开介绍。
  
  （2）ref 与 $parent / $children 适用 父子组件通信
  • ref：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
  • $parent / $children：访问父 / 子实例
  
  （3）EventBus （$emit / $on）  适用于 父子、隔代、兄弟组件通信
  这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件，从而实现任何组件间的通信，包括父子、隔代、兄弟组件
  
  （4）$attrs/$listeners 适用于 隔代组件通信
  • $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 ( class 和 style 除外 )。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 ( class 和 style 除外 )，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 inheritAttrs 选项一起使用。
  • $listeners：包含了父作用域中的 (不含 .native 修饰器的)  v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
  
  （5）provide / inject 适用于 隔代组件通信
  祖先组件中通过 provider 来提供变量，然后在子孙组件中通过 inject 来注入变量。 provide / inject API 主要解决了跨级组件间的通信问题，不过它的使用场景，主要是子组件获取上级组件的状态，跨级组件间建立了一种主动提供与依赖注入的关系。
  
  （6）Vuex  适用于 父子、隔代、兄弟组件通信
  Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。
  • Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
  • 改变 store 中的状态的唯一途径就是显式地提交  (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化。
````

+ Vue的两个核心是什么？
````
1、数据驱动：
在vue中，数据的改变会驱动视图的自动更新。传统的做法是需要手动改变DOM来使得视图更新，而vue只需要改变数据。

2、组件
组件化开发，优点很多，可以很好的降低数据之间的耦合度。将常用的代码封装成组件之后（vue组件封装方法），就能高度的复用，提高代码的可重用性。一个页面/模块可以由多个组件所组成。
````

+ vue和react的区别？
````
相同点：
1. 都提供了响应式和组件化的视图组件
2. 都采用virtual dom
3. 注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库(vue-router、vuex、react-router、redux等等)

不同点：
1. react的数据绑定是单向的 vue是双向的
2. 大数据量的渲染react会更快
3. 开发风格不同 react推荐用jsx 把html和css写在js（在 React 中，一切都是 JavaScript）； vue 采用webpack+vue-loader 将html css js都写在同一个文件中
````

+ vue组件中data为什么必须是一个函数？
````
Vue组件可能存在多个实例，如果使用对象形式定义data，则会导致它们共用一个data对象，那么状态变更将会影响所有组件实例，这是不合理的；
采用函数形式定义，在initData时会将其作为工厂函数返回全新data对象，保证组件复用的时候 各个组件数据的独立性
这都是因为js的特性带来的，跟vue本身设计无关。
js本身的面向对象编程也是基于原型链和构造函数，应该会注意原型链上添加一般都是一个函数方法而不会去添加一个对象了。
````

+ Vue 修饰符有哪些
````
事件修饰符
.stop 阻止事件继续传播
.prevent 阻止标签默认行为
.capture 使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
.self 只当在 event.target 是当前元素自身时触发处理函数
.once 事件将只会触发一次
.passive 告诉浏览器你不想阻止事件的默认行为


v-model 的修饰符
.lazy 通过这个修饰符，转变为在 change 事件再同步
.number 自动将用户的输入值转化为数值类型
.trim 自动过滤用户输入的首尾空格
````

+ vue 中使用了哪些设计模式
````
  1.工厂模式 - 传入参数即可创建实例
  虚拟 DOM 根据参数的不同返回基础标签的 Vnode 和组件 Vnode
  2.单例模式 - 整个程序有且仅有一个实例
  vuex 和 vue-router 的插件注册方法 install 判断如果系统存在实例就直接返回掉
  3.发布-订阅模式 (vue 事件机制)
  4.观察者模式 (响应式数据原理)
  5.装饰模式: (@装饰器的用法)
  6.策略模式 策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案-比如选项的合并策略
````

+ created和mounted请求接口的区别？
````
在created时期请求接口拿到页面数据，DOM 还没有渲染，最后数据和DOM会同步渲染在页面中。

在mounted时期请求接口拿到页面数据，DOM 已经渲染到页面中，拿到数据后在渲染数据。
````

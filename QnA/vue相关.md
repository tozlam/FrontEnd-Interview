### 请说一下响应式数据的理解？
数据的改变 视图会同步更新。分为两种情况：
1. 对象内部通过definedReactived方法，使用Object.definedProperty将数据进行劫持(只会劫持已存在的属性)。多层对象通过多层递归来劫持（因此数组没有通过此方法劫持，因为性能会非常差）
2. 数组通过重写数组方法来实现

内部收集依赖是怎么做的？
每个属性都有自己的dep属性，存放它所依赖的watcher，当属性发生变化的时候回通知对应的watcher去更新

````
let state = {count: 1};
let active;
function definedReative (obj) {  // 让对象变成响应式的
    for(let key in obj){
        let value = obj[key];
        let dep = [];
        Object.definedProperty(obj, key, {
            get() {
                if (active) {
                    dep.push(active);   // 依赖收集
                }
                return value;
            },
            set(newValue) { // 触发更新
                value = newValue;
                dep.forEach(watcher => watcher());
            }
        }
    }
}
definedReative(state);

const watcher = (fn) => {
    active = fn;
    fn();   // 调用函数
    active = null;  // 后续不在watcher中取值 不触发依赖收集
}
watcher(() => {
    app.innerHTML = state.count;
});

````

### vue如何检测数组的变化？
由于性能原因vue没有用definedProperty对数组的每一项进行拦截，而是选择重写数方法(push,pop,splice,shift,sort,reverse)进行重写

````
let state = [1,2,3];
let originArray = Array.prototype; // 数组原来的方法
let arrayMethods = Object.create(originArray);

function definedReative(obj) {
    // 函数劫持
    arrayMethods.push = function (...arg) {
        originArray.push.call(this,...arg);
        render();
    }
    obj._proto_ = arrayMethods
}
definedReative(state);
function render() {
    app.innerHTML = state;
}
render();
````

### proxy和Object.defineProperty
+ proxy是直接监听对象 而非属性，Object.defineProperty只能对对象的某个属性进行劫持
+ proxy可以直接监听数组的变化（proxy对不可配置的属性保持不变的语义），Object.defineProperty监听不到数组length的变化（因为length 属性的configurable是false，是不可以被改变的）
+ Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等 Object.defineProperty不具备
````
var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35


//要劫持的对象
const data = {
    name:''
}
  //遍历对象,对其属性值进行劫持
  Object.keys(data).forEach(function(key){
    Object.defineProperty(data,key,{
        enumerable: true,
        configurable: true,
        get: function() {
            console.log('get');
          },
          set: function(newVal) {
            // 当属性值发生变化时我们可以进行额外操作
            console.log(`我修改了成了${newVal}`);           
          },
    })
  })
  data.name = 'gg'
````

### vue.set()是如何实现的？
我们给对象和数组本身都增加了dep属性，当给对象新增不存在的属性则触发对象依赖的watcher去更新，当然修改数组索引时我们调用数组本身的splice方法去更新数组


### vue中模板编译原理
template转换成render函数：
template => ast => codegen => with+function生成render方法
1. 将template模板转换成ast语法树 --parseHTML
2. 对静态语法做静态标记 --makeup
3. 重新生成代码 --codeGen

render方法执行完毕后生成虚拟dom

### vue的生命周期有哪些？在哪一步发起请求？


### 生命周期钩子是如何实现的？
vue的生命周期钩子其实就是回调函数（在内部会转换成数组），当创建组件实例过程中会调用对应的钩子方法。
核心也是发布订阅模式。

### vue为什么需要虚拟dom？
虚拟dom就是用js对象来描述真实dom，是对真实dom的抽象。由于直接操作dom性能低，js层的操作效率高，
可以将dom操作转换成对象操作，最终通过diff算法比对差异更新dom（减少了对真实dom的操作）

### vue的diff原理
vue的diff算法是平级的比较，不考虑跨级的情况。内部采用深度递归+双指针的方式进行比较。

### vue组件的传值方式？
1. 父组件向子组件传递数据是通过props传递的，子组件向父组件传递数据是通过$emit触发事件来做到
2. $parent,$children获取当前组件的父组件和当前组件的子组件
3. $attr,$listen
4. 父组件通过provide来提供变量，子组件通过inject来注入
5. $refs获取实例
6. eventBus平级组件数据传递
7. vuex状态管理

### vue组件的渲染流程？
1. 在渲染父组件时会创建父组件的虚拟节点，其中可能包含子组件的标签
2. 在创建虚拟节点时获取组件的定义使用的vue.extend 生成组件的构造函数
3. 将虚拟节点转化成真实节点时 会创建组件的实例并调用组件的$mount方法
4. 所以组件的创建过程是先父后子

// 父beforeCreated
// 子beforeCreated
// 子created
// 父created

### v-for循环时为什么要加key？
vue的dom渲染是虚拟dom，数据发生变化时，diff算法会只比较更改的部分，如果数据项的顺序被改变，Vue将不是移动DOM元素来匹配数据项的改变，而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素。举例说明：有一个列表我们现在在中间插入了一个元素，diff算法会默认复用之前的列表并在最后追加一个，如果列表存在选中一类的状态则会随着复用出现绑定错误的情况而不是跟着原元素，key的作用就可以给他一个标识，让状态跟着数据渲染。

### vue组件中data为什么是个函数？
每次使用组件时都会对组件进行实例化操作，并且调用data函数返回一个对象作为组件的数据源，这样可以保证多个组件间数据互不影响

### v-if和v-show的区别？
v-if在编译过程中会回被转换成三元表达式，条件不满足时不渲染此节点。
v-show会编译成指令，条件不满足时控制样式将对应节点隐藏，内部其他指令会继续执行

### vue-router有几种钩子函数？具体是什么以及执行流程是怎样？
种类有全局守卫、路由守卫、组件守卫

完整的导航解析流程：
1. 导航被触发
2. 在失活的组件里调用beforeRouteLeave守卫
3. 调用全局的beforeEach守卫
4. 在重用的组件里调用beforeRouteUpdate守卫
5. 在路由配置里调用beforeEnter守卫
6. 解析路由异步组件
7. 在被激活的组件里调用beforeRouteEnter
8. 调用全局的beforeResolve守卫
9. 导航被确认
10. 调用全局的afterEach守卫
11. 触发DOM更新
12. 调用beforeRouteEnter守卫中传给next的回调函数

### vue-router两种模式的区别？
hash模式： hash + hashchange 兼容性好但是不美观
它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面
history模式： historyApi + popState 虽然美观 但是刷新会出现404需要后端进行配置

### v-if和v-for的优先级
v-if和v-for不要在同一个标签中使用，因为解析时先解析v-for再解析v-if。如需同时使用可以考虑写成计算属性形式。

### 组件中写name的好处及作用？
1. 可以通过名字找到对应的组件（递归组件）
2. 可以通过name属性实现缓存功能（keep-alive）
3. 可以通过name来识别组件（跨级组件t通信时非常重要）

### vue事件修饰符有哪些？实现原理是什么？
.capture .once .passive .stop .self .prevent

### 谈一谈对vuex的理解?
vuex是全局状态管理系统，所有组件可以共享这个vuex。用于多个组件的数据共享、数据缓存，但无法持久化
核心原理是创造了一个全局的一个vue实例

### vuex中action和mutation的区别
action是处理异步逻辑，mutation是更新状态

### 为什么Vuex要通过mutations修改state，而不能直接修改
因为state是实时更新的，mutations无法进行异步操作，而如果直接修改state的话是能够异步操作的，当你异步对state进行操作时，还没执行完，
这时候如果state已经在其他地方被修改了，这样就会导致程序存在问题了。所以state要同步操作，通过mutations的方式限制了不允许异步。

而且通过mutations来修改state可以记录下每次修改，方便调试。

### vue中slot是如何实现的？
（插槽类型：
默认插槽：模板传到组件中，数据采用父组件数据（父组件渲染 并替换）
具名插槽：子组件用name属性来表示插槽的名字，不传为默认插槽；父组件中在使用时在默认插槽的基础上加上slot属性，值为子组件插槽name属性值
作用域插槽：子组件在作用域上绑定属性来将子组件的信息传给父组件使用，这些属性会被挂在父组件v-slot接受的对象上；父组件中在使用时通过v-slot:（简写：#）获取子组件的信息，在内容中使用
）

普通插槽：模板传到组件中，数据采用父组件数据（父组件渲染 并替换）
作用域插槽： 在父组件中访问子组件数据（父组件渲染出一个函数，子组件调用函数并传入参数 子组件渲染）

### keep-alive平时在哪里使用？原理是？
keep-alive主要是用于缓存，采用LRU算法（最近最久未使用法）

LRU：
A B C D E
[A,B,D,C,E]
// 最久的就是第一项 最近的就是最后一项

### vue中用了哪些设计模式？
* 工厂模式：传入参数即可创建实例（createElement）
* 单例模式：vuex、vue-router 整个程序有且只有一个实例
* 观察者模式：watcher和dep
* 发布订阅模式：$on、$emit
* 代理模式：防抖和节流 =>
* 装饰模式：@装饰器用法
* 中介者模式： vuex

### vue3和2的区别？
1. app.config.globalPropeties.xxx 可以实现之前 vue.prototype.xxx的功能
2. proxy代理
3. Composition API

### Vue3.0里为什么要用 Proxy API 替代 defineProperty API ？
1. Object.defineProperty只能遍历对属性进行劫持，proxy可以对整个对象进行劫持并返回一个新的对象，我们可以只对新的对象进行操作达到响应式的目的
2. proxy可以直接监听数组的变化
3. proxy有13种拦截方法不限于apply、ownKeys、deleteProperty、has等等，这是Object.defineProperty不具备的；
正因为defineProperty自身的缺陷，导致Vue2在实现响应式过程需要实现其他的方法辅助（如重写数组方法、增加额外set、delete方法）


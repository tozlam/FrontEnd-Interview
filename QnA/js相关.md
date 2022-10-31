### instanceof的作用及原理/实现？
- instanceof 用来判断一个对象构造函数的prototype是否存在于另一个对象的原型链上

- 实现：

````
    function myInstanceof (left, right) {
        let proto = Object.getPrototypeOf(left);
        let prototype = right.prototype;
        
        while(1) {
            if (proto === prototype) {
                return true;
            }
            
            proto = Object.getPrototypeOf(proto);
            
            if (!proto) {
                return false;
            }
        }
    }
````

- 原理： 
 拿到对象1的构造函数prototype和对象2的原型进行匹配，如果匹配不到则向对象2的原型链进行匹配，
 直到原型链到达Object.getPrototypeOf === null 的时候，返回false；
 
 ### new 操作符具体干了什么呢？如何实现？
 - 创建一个空对象
 - 设置原型，将对象的原型设置为构造函数的prototype
 - 将this指向新对象并执行构造函数
 - 判断构造函数返回的值的类型 如果是引用类型则直接返回这个引用类型 如果是值则返回新对象
 
 ````
 function myNew() {
    let obj = new Object();// 创建一个空的对象
    let constructor = [].call(arguments);// 获得构造函数
    object._proto_ = constructor.prototype;// 链接到原型
    let result = constructor.apply(obj, arguments);// 绑定 this，执行构造函数
    return typeof result === 'object' ? result : obj; // 确保 new 出来的是个对象
 }
 
 ````

### 垃圾回收机制
````
JavaScript代码运行时，需要分配内存空间来储存变量和值。当变量不在参与运行时，就需要系统收回被占用的内存空间，这就是垃圾回收。

● Javascript 具有自动垃圾回收机制，会定期对那些不再使用的变量、对象所占用的内存进行释放，原理就是找到不再使用的变量，然后释放掉其占用的内存。
● JavaScript中存在两种变量：局部变量和全局变量。
全局变量的生命周期会持续要页面卸载；
而局部变量声明在函数中，它的生命周期从函数执行开始，直到函数执行结束，在这个过程中，局部变量会在堆或栈中存储它们的值，当函数执行结束后，这些局部变量不再被使用，它们所占有的空间就会被释放。
● 不过，当局部变量被外部函数使用时，其中一种情况就是闭包，在函数执行结束后，函数外部的变量依然指向函数内部的局部变量，此时局部变量依然在被使用，所以不会回收。

浏览器通常使用的垃圾回收方法有两种：标记清除，引用计数。

虽然浏览器可以进行垃圾自动回收，但是当代码比较复杂时，垃圾回收所带来的代价比较大，所以应该尽量减少垃圾回收。
● 对数组进行优化：在清空一个数组时，最简单的方法就是给其赋值为[ ]，但是与此同时会创建一个新的空对象，可以将数组的长度设置为0，以此来达到清空数组的目的。
● 对object进行优化：对象尽量复用，对于不再使用的对象，就将其设置为null，尽快被回收。
● 对函数进行优化：在循环中的函数表达式，如果可以复用，尽量放在函数的外面。
````
 
### 前端页面性能指标
````
首先前端性能指标一般分为以下几种：

首屏绘制（First Paint，FP） 是时间线上的第一个“时间点”，是指浏览器从响应用户输入网址地址，到浏览器开始显示内容的时间，简而言之就是浏览器第一次发生变化的时间。
  + 一种比较简单的做法是在 body 标签之前获取当前时间 - performance.timing.navigationStart,
  或者直接获取 performance 中关于 paint 的两个数据，都可以直接作为白屏数据，这两个数据一般差别不大。
首屏内容绘制（First Contentful Paint，FCP） 是指浏览器从响应用户输入网络地址，在页面首次绘制文本，图片（包括背景图）、非白色的 canvas 或者SVG 才算做 FCP
  + performance.timing.loadEventEnd - performance.timing.navigationStart
可交互时间（Time to Interactive，TTI） 表示网页第一次完全达到可交互状态的时间点。可交互状态指的是页面上的 UI 组件是可以交互的（可以响应按钮的点击或在文本框输入文字等），不仅如此，此时主线程已经达到“流畅”的程度，主线程的任务均不超过50毫秒。在一般的管理系统中，TTI 是一个很重要的指标。
  + domContentLoadedEventEnd - navigationStart
最大内容绘制（Largest Contentful Paint，LCP)  表示页面的“主要内容”开始出现在屏幕上的时间点，它以前是我们测量用户加载体验的主要指标。本质上是通过一个算法来猜测某个时间点可能是 FMP，但是最好的情况也只有77%的准确率，在lighthouse6.0 的时候废弃掉了这个指标，取而代之的是 LCP 这个指标。
首次有效绘制（First Meaning Paint, FMP） 表示可视区“内容”最大的可见元素开始出现在屏幕上的时间点。

````

### ESM和CommonJS的区别
````
CommonJS 模块输出的是一个值的拷贝，ESM输出的是值的引用。
  + CommonJS一旦输出一个值，模块内部的变化就影响不到这个值
  + ESM是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块
CommonJS 模块是运行时加载，ESM是编译时加载，效率要比 CommonJS 模块的加载方式高。
ES6 Module可以导出多个值，而CommonJs 是单个值导出
CommonJS 模块的require()是同步加载模块，ESM的import命令是异步加载，有一个独立的模块依赖的解析阶段。

+ Commonjs模块加载ESM模块
CommonJS 的require()命令不能加载 ES6 模块，会报错，只能使用import()这个方法加载。
require()不支持 ES6 模块的一个原因是，它是同步加载，而 ES6 模块内部可以使用顶层await命令，导致无法被同步加载。

+ ESM模块加载Commonjs模块
只能整体加载，不能只加载单一的输出项
// 正确
import packageMain from 'commonjs-package';
// 报错
import { method } from 'commonjs-package';
因为 ES6 模块需要支持静态代码分析，而 CommonJS 模块的输出接口是module.exports，是一个对象，无法被静态分析，所以只能整体加载


````

### Object.create(null)和直接创建一个{}有什么区别？
````
1、Object.create() 必须接收一个对象参数，创建的新对象的原型指向接收的参数对象
  而通过Object.create(null)创建的对象是一个干净的对象，也就是没有原型，不继承Object原型链上的属性
2、new Object()创建的对象是 Object的实例，原型永远指向Object.prototype，{}创建的对象与其一样都会继承Object对象的所有属性

Object.create(null)的应用场景
可以创建一个干净且高度可定制的对象当做数据字典，进行循环取用，可以提高循环效率。
这个时候如果对象有原型链，那便会在循环的时候去循环它的各个属性和方法，效率则会降低
````



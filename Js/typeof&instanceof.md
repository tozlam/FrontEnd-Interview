# typeof / instanceof

## typeof
- 首先需要注意的是，typeof方法返回一个字符串，来表示数据的类型。
<table>
<tr><td>数据类型</td><td>	Type</td></tr>
<tr><td>Undefined	</td><td>“undefined”</td></tr>
<tr><td>Null	</td><td>“object”</td></tr>
<tr><td>布尔值	</td><td>“boolean”</td></tr>
<tr><td>数值	</td><td>“number”</td></tr>
<tr><td>字符串	</td><td>“string”</td></tr>
<tr><td>Symbol (ECMAScript 6 新增)	</td><td>“symbol”</td></tr>
<tr><td>宿主对象(JS环境提供的，比如浏览器)</td><td>	Implementation-dependent</td></tr>
<tr><td>函数对象	</td><td>“function”</td></tr>
<tr><td>任何其他对象	</td><td>“object”</td></tr>

````
// Numbers
typeof 37 === 'number';
typeof 3.14 === 'number';
typeof Math.LN2 === 'number';
typeof Infinity === 'number';
typeof NaN === 'number'; // 尽管NaN是"Not-A-Number"的缩写,意思是"不是一个数字"
typeof Number(1) === 'number'; // 不要这样使用!

// Strings
typeof "" === 'string';
typeof "bla" === 'string';
typeof (typeof 1) === 'string'; // typeof返回的肯定是一个字符串
typeof String("abc") === 'string'; // 不要这样使用!

// Booleans
typeof true === 'boolean';
typeof false === 'boolean';
typeof Boolean(true) === 'boolean'; // 不要这样使用!

// Symbols
typeof Symbol() === 'symbol';
typeof Symbol('foo') === 'symbol';
typeof Symbol.iterator === 'symbol';

// Undefined
typeof undefined === 'undefined';
typeof blabla === 'undefined'; // 一个未定义的变量,或者一个定义了却未赋初值的变量

// Objects
typeof {a:1} === 'object';

// 使用Array.isArray或者Object.prototype.toString.call方法可以从基本的对象中区分出数组类型
typeof [1, 2, 4] === 'object';

typeof new Date() === 'object';

// 下面的容易令人迷惑，不要这样使用！
typeof new Boolean(true) === 'object';
typeof new Number(1) ==== 'object';
typeof new String("abc") === 'object';

// 函数
typeof function(){} === 'function';
typeof Math.sin === 'function';

````



## instanceof
- instanceof运算符可以用来判断某个构造函数的prototype属性是否存在于另外一个要检测对象的原型链上。
````
// 定义构造函数
function C(){} 
function D(){} 

var o = new C();

// true，因为 Object.getPrototypeOf(o) === C.prototype
o instanceof C; 

// false，因为 D.prototype不在o的原型链上
o instanceof D; 

o instanceof Object; // true,因为Object.prototype.isPrototypeOf(o)返回true
C.prototype instanceof Object // true,同上

C.prototype = {};
var o2 = new C();

o2 instanceof C; // true

o instanceof C; // false,C.prototype指向了一个空对象,这个空对象不在o的原型链上.

D.prototype = new C(); // 继承
var o3 = new D();
o3 instanceof D; // true
o3 instanceof C; // true
```` 
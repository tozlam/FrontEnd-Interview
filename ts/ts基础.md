#### ts数据类型
typescript 的数据类型主要有如下：
+ boolean（布尔类型） 
+ number（数字类型） 
+ string（字符串类型） 
+ array（数组类型） 
+ tuple（元组类型） 
+ enum（枚举类型） 
+ any（任意类型） 
+ null 和 undefined 类型 
+ void 类型 
+ never 类型 
+ object 对象类型

### 枚举
1. 数字枚举
````
当我们声明一个枚举类型是,虽然没有给它们赋值,但是它们的值其实是默认的数字类型,而且默认从0开始依次累加:

enum Direction {
    Up,   // 值默认为 0
    Down, // 值默认为 1
    Left, // 值默认为 2
    Right // 值默认为 3
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
如果我们将第一个值进行赋值后，后面的值也会根据前一个值进行累加1：

enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}

console.log(Direction.Up, Direction.Down, Direction.Left, Direction.Right); // 10 11 12 13
````
2. 字符串枚举
````
枚举类型的值其实也可以是字符串类型：

enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up
如果设定了一个变量为字符串之后，后续的字段也需要赋值字符串，否则报错：

enum Direction {
 Up = 'UP',
 Down, // error TS1061: Enum member must have initializer
 Left, // error TS1061: Enum member must have initializer
 Right // error TS1061: Enum member must have initializer
}
````
3. 异构枚举
````
即将数字枚举和字符串枚举结合起来混合起来使用，如下：

enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
````
本质：
````
enum Direction {
    Up,
    Down,
    Left,
    Right
}
Direction["Up"] = 0
Direction[0] = "Up"
所以定义枚举类型后，可以通过正反映射拿到对应的值，如下：

enum Direction {
    Up,
    Down,
    Left,
    Right
}

console.log(Direction.Up === 0); // true
console.log(Direction[0]); // Up
````

### interface和type的区别？
1.接口(Interface)
接口主要用于类型检查，它只是一个结构契约，定义了具有相似的名称和类型的对象结构。除此之外，接口还可以定义方法和事件。interface只能定义对象类型

2.类型别名(Type Alias)
type除了可以定义对象类型，还可以定义基础类型、联合类型或交叉类型。

差异：
1. 定义类型范围
````
interface只能定义对象类型, 而type声明可以声明任何类型，包括基础类型、联合类型或交叉类型。

// 基本类型
type person = string

// 联合类型
interface Dog {
name: string;
}
interface Cat {
age: number;
}
type animal = Dog | Cat

// 元组类型
interface Dog {
name: string;
}
interface Cat {
age: number;
}
type animal = [Dog, Cat]
````
2. .扩展性
````
接口可以extends、implements,从而扩展多个接口或类。类型没有扩展功能。
// interface extends interface
interface Person {
  name: string
}
interface User extends Person {
  age: number
}
 
// interface extends type
type Person = {
  name: string
}
interface User extends Person {
  age: number
}

type可以使用交叉类型&，来使成员类型合并

// type & type
type Person = {
   name: string
}
type User = Person & { age: number }
 
// type & interface
interface Person {
  name: string
}
type User = {age: number} & Person
````
3. 合并声明
````
定义两个相同名称的接口会合并声明。

定义两个同名的type会出现异常。

interface Person { 
  name: string
}
interface Person {
  age: number
}
// 合并为:interface Person { name: string age: number}
````

### 高级类型
常见的高级类型有如下：
1. 交叉类型
````
通过 & 将多个类型合并为一个类型，包含了所需的所有类型的特性，本质上是一种并的操作
语法如下：
T & U
````
2. 联合类型 
````
联合类型的语法规则和逻辑 “或” 的符号一致，表示其类型为连接的多个类型中的任意一个，本质上是一个交的关系
语法如下：
T | U
例如 number | string | boolean 的类型只能是这三个的一种，不能共存
````
3. 类型别名 
````
可以使用 type SomeName = someValidTypeAnnotation的语法来创建类型别名：
type some = boolean | string

const b: some = true // ok
const c: some = 'hello' // ok
const d: some = 123 // 不能将类型“123”分配给类型“some”
此外类型别名可以是泛型:

type Container<T> = { value: T };
也可以使用类型别名来在属性里引用自己：

type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
````
4. 类型索引 
````
keyof 类似于 Object.keys ，用于获取一个接口中 Key 的联合类型。

interface Button {
    type: string
    text: string
}

type ButtonKeys = keyof Button
// 等效于
type ButtonKeys = "type" | "text"
````
5. 类型约束 
````
通过关键字 extend 进行约束，不同于在 class 后使用 extends 的继承作用，泛型内使用的主要作用是对泛型加以约束

type BaseType = string | number | boolean

// 这里表示 copy 的参数
// 只能是字符串、数字、布尔这几种基础类型
function copy<T extends BaseType>(arg: T): T {
  return arg
}

类型约束通常和类型索引一起使用，例如我们有一个方法专门用来获取对象的值，但是这个对象并不确定，我们就可以使用 extends 和 keyof 进行约束。

function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}

const obj = { a: 1 }
const a = getValue(obj, 'a')
````
6. 映射类型 
````
通过 in 关键字做类型的映射，遍历已有接口的 key 或者是遍历联合类型，如下例子：

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

interface Obj {
  a: string
  b: string
}

type ReadOnlyObj = Readonly<Obj>
上述的结构，可以分成这些步骤：

keyof T：通过类型索引 keyof 的得到联合类型 'a' | 'b'
P in keyof T 等同于 p in 'a' | 'b'，相当于执行了一次 forEach 的逻辑，遍历 'a' | 'b'
所以最终ReadOnlyObj的接口为下述：

interface ReadOnlyObj {
    readonly a: string;
    readonly b: string;
}
````
7. 条件类型
````
条件类型的语法规则和三元表达式一致，经常用于一些类型不确定的情况。

T extends U ? X : Y
上面的意思就是，如果 T 是 U 的子集，就是类型 X，否则为类型 Y
````

### 装饰器
1. 什么是装饰器
````
装饰器是通过添加标注的方式，来对类型进行扩展的一种方式。

只能在类中使用
减少冗余代码量
提高代码扩展性
````
2. 装饰器语法
````
装饰器的使用非常简单，装饰器本质就是一个函数，在特定的位置调用装饰器函数即可对数据（类、方法、甚至参数等）进行扩展。
````
3. 装饰器的分类
    1. 类装饰器
    ````
    类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
   
    @testable
    class MyTestableClass {}
    
    function testable(target) {
    target.isTestable = true;
    }
    
    MyTestableClass.isTestable // true
    ````
   2. 类方法装饰器
   ````
   方法装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
    对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    成员的名字。
    成员的属性描述符。
   
    下面的例子演示让类的方法变为只读。
   function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
   }
    class Cat {
      @readonly
      say() {
        console.log("meow ~");
      }
    }
   ````
   3. 类属性装饰器
   ````
   属性装饰器表达式会在运行时当作函数被调用，传入下列2个参数：
    对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    成员的名字。

   class MyTestableClass {
    @testable
    name: string;
    constructor(name: string) {
        this.name = name;
    }
   }

    function testable(target, name) {
      console.log(arguments)
    }
   ````
   4. 参数装饰器
   ````
   参数装饰器表达式会在运行时当作函数被调用，传入下列3个参数：
    对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
    成员的名字。
    参数在函数参数列表中的索引。
   
   注意：参数装饰器只能用来监视一个方法的参数是否被传入。参数装饰器的返回值会被忽略。
   
   class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet(@required name: string) {
        return "Hello " + name + ", " + this.greeting;
    }
   }
   ````
4. 装饰器的执行顺序
````
1. 实例装饰器：属性装饰 -> 访问器装饰 -> 参数装饰 => 方法装饰
2. 静态装饰器: 属性 => 访问器 => 参数 => 方法
3. 类装饰器
````

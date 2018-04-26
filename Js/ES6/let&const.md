# let const

- let、const用途与var类似，用来声明变量。但let、const只在所声明的块级作用域内有效。
- var：ES5只有全局作用域和函数作用域，没有块级作用域
- var存在变量提升，但let和const所声明的变量一定要在声明后使用，声明之前变量不存在

### let
- let命令有四大主要特性：存在块级作用域，没有变量提升，暂时性死区，不允许重复声明。
- let有块级作用域，用它所声明的变量只在let命令所在的代码块内有效
````
{
    let a=10;
    var b=1;
}
a       // Error
b       //1
````
- for循环的计数器就适合使用let命令
````
for(let i=0;i<10;i++){}
console.log(i);             //Error
````
for循环的特别之处就是循环语句部分是一个父作用域，而循环体内部是一个单独的子作用域。
````
for（let i=0;i<3){
    let i="abc";
    console.log(i); //abc abc abc 
    }
//内部、外部i分离
````
for循环头部的let声明还有一个特殊的行为。这个行为指出变量在循环过程中不止被声明一次，每次迭代都会被声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。
```
for(let i=1;i<=5;i++){
    setTimerout(function timer(){
        console.log(i);
        },i*1000);
    }
````
### const
- const声明的是常量，一旦声明常量的值就不能改变
- const应用场景：当我们引用第三方库的声明的变量，用const来声明可以避免未来不小心重命名而导致出现bug
- const一旦声明就必须立即初始化，不能留到以后赋值
````
const PI=3.1415; 
PI=3;           //Error
const foo;      //Error 只声明不赋值会报错
````

### 暂时性死区
- 只要块级作用域内存在let、const命令，它所声明的变量就“绑定”这个区域，不再受外部的影响
````
if(true){                   //暂时性死区开始
    temp="abc";             //Error
    console.log(temp);      //Error
    let temp;               //暂时性死区结束
    console.log(temp);      //undefined
    temp=123;
    console.log(temp);      //123
    }
````
- 总之，在代码块内，使用let、const命令声明变量之前，该变量都是不可用的，这在语法上称为“暂时性死区”

### 不允许重复声明
````
function(){
    let a=10;
    var a=10;
    }           //报错
    
function(){
    let a=10;
    let a=1;
    }           //报错
    
function func(arg){
    let arg;   //报错
    }
    
function func(arg){
    {
        let arg;
        }
  }         //不报错
````

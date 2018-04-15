# let const

- let、const用途与var类似，用来声明变量。但let、const只在所声明的块级作用域内有效。
- var：ES5只有全局作用域和函数作用域，没有块级作用域
- let有块级作用域，用它所声明的变量只在let命令所在的代码块内有效
- const声明的是常量，一旦声明常量的值就不能改变
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
console.log(i_;             //Error
````
for循环的特别之处就是循环语句部分是一个父作用域，而循环体内部是一个单独的子作用域。
````
for（let i=0;i<3){
    let i="abc";
    console.log(i); //abc abc abc 
    }
//内部、外部i分离
````
- const应用场景：当我们引用第三方库的声明的变量，用const来声明可以避免未来不小心重命名而导致出现bug
- const一旦声明就必须立即初始化，不能留到以后赋值
````
const PI=3.1415; 
PI=3;           //Error
const foo;      //Error 只声明不赋值会报错
````

- var存在变量提升，但let和const所声明的变量一定要在声明后使用，声明之前变量不存在
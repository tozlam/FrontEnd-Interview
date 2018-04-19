# JS多继承实现

###  ES6间接继承
     
 如果我想实现A继承自B和C，有两种方法，一种是A直接继承自B和C，另一种是A继承自B，B继承自C，也可以实现多继承
 
 ````
 var CalculatorMixin = Base => class extends Base { 
     constructor(...args){
         super(...args);
         console.log("CalculatorMixin",args);
     } 
     calc() {  
         console.log("calc");  
     }  
 };  
   
 var RandomizerMixin = Base => class extends Base {  
     constructor(...args){
         super(...args);
         console.log("RandomizerMixin",args);
     }
     randomize() {
         super.foo();  
         console.log("randomize");  
     }  
 };  
   
 class Foo {  
     constructor(...args){
         console.log("Foo",args);
     } 
     foo(){  
         console.log("foo");  
     }  
 }  
 class Bar extends CalculatorMixin(RandomizerMixin(Foo)) {
 
 }  
   
 var b = new Bar(1,2,3);  
 b.foo();  
 b.randomize();  
 b.calc(); 
 
 console.log(b instanceof Bar)//true
 console.log(b instanceof Foo)//true
 console.log(b instanceof CalculatorMixin)//报错
 console.log(b instanceof RandomizerMixin)//报错
 ````
 
上面这种方法利用了ES6中class的extends后面可以使用表达式特性，间接实现多继承。
<br>这种方法有个缺点是CalculatorMixin等Mixin函数其实是个箭头函数，无法用instanceof检测，因为箭头函数没有显示原型。

- 改进缺点：
````
var CalculatorMixin = Base => class extends Base { 
    constructor(...args){
        super(...args);
        console.log("CalculatorMixin",args);
    } 
    calc() {  
        console.log("calc");  
    }  
};  
  
var RandomizerMixin = Base => class extends Base {  
    constructor(...args){
        super(...args);
        console.log("RandomizerMixin",args);
    }
    randomize() {
        super.foo();  
        console.log("randomize");  
    }  
};  

  
class Foo {  
    constructor(...args){
        console.log("Foo",args);
    } 
    foo(){  
        console.log("foo");  
    }  
}  
class Bar extends CalculatorMixin(RandomizerMixin(Foo)) {

}  
  
var b = new Bar(1,2,3);  
b.foo();  
b.randomize();  
b.calc(); 

CalculatorMixin.prototype = Object.create({});//需要继承自Object，这里如果写null的话，instanceof Object会是false
RandomizerMixin.prototype = Object.create(null);
Object.setPrototypeOf(RandomizerMixin.prototype,CalculatorMixin.prototype)
Object.setPrototypeOf(Foo.prototype,RandomizerMixin.prototype)


console.log(b instanceof Bar)//true
console.log(b instanceof Foo)//true
console.log(b instanceof CalculatorMixin)//true
console.log(b instanceof RandomizerMixin)//true
console.log(b instanceof Object)//true
````

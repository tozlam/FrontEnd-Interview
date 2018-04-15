# class、extends、super
````
//类的定义
class person {
	//ES6中新型构造器
    constructor(name) {
        this.name = name;
    }
    //实例方法
    sayName() {
        console.log('My name is '+this.name);
    }
}
//类的继承
class Programmer extends person {
    constructor(name) {
    	//直接调用父类构造器进行初始化
        super(name);//子类中有constructor类就必须调用super，否则新建实例时会报错(this is not defined)，这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工
    }
    program() {
        console.log("I'm coding...");
    }
}
//测试我们的类
var person=new person('tozlam');
zijian=new Programmer('zijian');
person.sayName();//输出 ‘My name is tozlam’
zijian.sayName();//输出 ‘My name is zijian’
zijian.program();//输出 ‘I'm coding...’
````
### 类声明
constructor是一个默认方法，使用new来定义实例对象时，自动执行constructor函数，传入所需要的参数,执行完constructor后自动返回实例对象。

一个类中只能有一个constructor函数，定义多个会报错。

constructor中的this指向新创建的实例对象，利用this往新创建的实例对象扩展属性。

在定义实例对象时，不需要在初始化阶段做一些事，可以不用显示的写constructor函数。如果没有显式定义，一个空的constructor方法会被默认添加，constructor(){}

### 类表达式
类表达式是定义类的另一种形式，类似于函数表达式，把一个函数作为值赋给变量。可以把定义的类赋值给一个变量，这时候变量就为类名。class关键字之后的类名可有可无，如果存在，则只能在类内部使用。

1. 定义类 class后面有类名：
````
 const People = class StdInfo {
    constructor(){
        console.log(StdInfo);  //可以打印出值，是一个函数
    }
}

new People();
new StdInfo();  //报错，StdInfo is not defined；
````
2. 定义类 class后面没有类名：
````
const People = class {
    constructor(){

    }
}

new People();
````
3. 立即执行的类：
````
const p = new class {
    constructor(name,age){
        console.log(name,age);
    }
}("job",30)
````
立即执行的类，在类前要加上new。p为类的实例对象。
###　构造函数
- 上面代码定义了一个“类”,可以看到里面有一个constructor方法,这就是构造方法,而this关键字则代表实例对象。也就是说,ES5的构造函数Person,对应ES6的Person类的构造方法。Person类除了构造方法,还定义了一个toString方法。注意,定义“类”的方法的时候,前面不需要加上function这个关键字,直接把函数定义放进去了就可以了。另外,方法之间不需要逗号分隔,加了会报错。
ES6的类,完全可以看作构造函数的另一种写法。
````
console.log(typeof Person);//function  
console.log(Person === Person.prototype.constructor);//true
````
- 上面代码表明,类的数据类型就是函数,类本身就指向构造函数。

- constructor方法是类的构造函数是默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个默认的constructor方法会被添加。所以即使你没有添加构造函数,也是有默认的构造函数的。一般constructor方法默认返回实例对象this，但是也可以指定constructor方法返回一个全新的对象,让返回的实例对象不是该类的实例。
- 类的构造函数，不使用new是没法调用的,即使你使用实例对象去调用也是不行的,这是它跟普通构造函数的一个主要区别。

### 不存在变量提升
- 定义类不存在变量提升，只能先定义类后使用，跟函数声明有区别的。

### __ proto__
````
class Person{  
    // 构造  
    constructor(x,y){  
        this.x = x;  
        this.y = y;  
    }  
  
    toString(){  
        return (this.x + "的年龄是" +this.y+"岁");  
    }  
}  
let p1=new Person("zijian",21);
let p2=new Person("runrun",20);
````
- 类的所有实例共享一个原型对象,p1和p2都是Person的实例,它们的原型都是Person.prototype，所以__proto__属性是相等的。<br>
这也意味着，可以通过实例的__proto__属性为Class添加方法。
````
p1.__proto__.getH = function (){  
    return "Height";  
};  
````
- 上面代码在p1的原型上添加了一个getH方法，由于p1的原型就是person2的原型，因此p2也可以调用这个方法。而且，此后新建的实例p3也可以调用这个方法。这意味着，使用实例的__proto__属性改写原型，必须相当谨慎，不推荐使用，因为这会改变Class的原始定义，影响到所有实例。

### class的静态方法
````
//定义静态方法  
static getAge(){  
 return '获取Age的静态方法';  
}  
//通过类名直接调用  
console.log(StaticMethod.getAge());
````
- 如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
- 静态方法只能在静态方法中调用,不能再实例方法中调用。

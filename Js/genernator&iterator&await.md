### iterator迭代器

+ 遍历器（Iterator）是一种机制(接口)：为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署Iterator接口，就可以完成遍历操作「for of循环」，依次处理该数据结构的所有成员
    + 拥有next方法用于依次遍历数据结构的成员
    + 每一次遍历返回的结果是一个对象 {done:false,value:xxx}
        + done:记录是否遍历完成
        + value:当前遍历的结果

+ 拥有Symbol.iterator属性的数据结构(值)，被称为可被遍历的，可以基于for of循环处理
   + 数组
   + 部分类数组：arguments/NodeList/HTMLCollection...
   + String
   + Set
   + Map
   + generator object
   + ...

+ 对象默认不具备Symbol.iterator，属于不可被遍历的数据结构
````
class Iterator {
    constructor(assemble) {
        let self = this;
        self.assemble = assemble;
        self.index = 0;
    }
    next() {
        let self = this,
            assemble = self.assemble;
        if (self.index > assemble.length - 1) {
            return {
                done: true,
                value: undefined
            };
        }
        return {
            done: false,
            value: assemble[self.index++]
        };
    }
}
let itor = new Iterator([10, 20, 30, 40]);
console.log(itor.next()); //->{value:10,done:false}
console.log(itor.next()); //->{value:20,done:false}
console.log(itor.next()); //->{value:30,done:false}
console.log(itor.next()); //->{value:40,done:false}
console.log(itor.next()); //->{value:undefined,done:true}

// 让对象也具备迭代器规范
Object.prototype[Symbol.iterator] = function () {
    let assemble = this,
        keys = Object.keys(assemble)
            .concat(Object.getOwnPropertySymbols(assemble)),
        index = 0;
    return {
        next() {
            if (index > keys.length - 1) {
                return {
                    done: true,
                    value: undefined
                };
            }
            return {
                done: false,
                value: assemble[keys[index++]]
            };
        }
    };
};
let obj = {
    name: 'zhufeng',
    age: 12,
    teacher: 'team'
};
for (let value of obj) {
    console.log(value);
}
````

### generator
function* 生成器函数名称() {}
+ 把它当做一个实例 __proto__:
    + 普通函数是 Function 的实例，
      普通函数.__proto__===Function.prototype,
      生成器函数是 Generator 的实例,
      生成器函数.__proto__===Generator.prototype,
      Generator.prototype.__proto__===Function.prototype
    + ({}).toString.call(生成器函数) => "[object Generator]"
+ 把它作为一个构造函数 prototype
    +  生成器函数不能被new执行
    + 当做普通函数执行，返回的结果就是生成器函数的一个实例
````
function* generator() {
    console.log('A');
    yield 10;
    console.log('B');
    yield 20;
    console.log('C');
    yield 30;
    console.log('D');
    return 100;
}
let itor = generator();
console.log(itor.next()); //->{value:10,done:false} // 返回结果是具备done/value的对象，并且value是yield后面的值
console.log(itor.next()); //->{value:20,done:false}
console.log(itor.next()); //->{value:30,done:false}
console.log(itor.next()); //->{value:100,done:true}
console.log(itor.next()); //->{value:undefined,done:true} 
console.log(itor.return('xxx')); // -> {value: 'xxx', done: true}
console.log(itor.throw('xxx')); // 直接抛出异常 没有返回值 后面的代码都不执行了


function* generator() {
    console.log('A');
    let A = yield 1;
    console.log('B',A); // -> 'B',100
    let B = yield 2;
    console.log('C', B);
}
let itor = generator();
console.log(itor.next());// {value: 1, done:false}
console.log(itor.next(100));
// 每一次next传递的值（除了第一次）：都是作为上一次yeild的返回结果



function* generator1() {
    yield 10;
    yield 20;
}

function* generator2() {
    yield 10;
    yield generator1();
    yield 20;
}
let itor = generator2();
console.log(itor.next()); //value:10  done:false
console.log(itor.next()); //value:generator1执行创建的对象 done:false
console.log(itor.next()); //value:20  done:false
console.log(itor.next()); //value:undefined done:true 



function* generator1() {
    yield 10;
    yield 20;
}

function* generator2() {
    yield 10;
    yield* generator1(); // yeild* 后面跟着一个新的itor，后期执行到这的时候，会进入到新的generator中执行
    yield 20;
}
let itor = generator2();
console.log(itor.next()); //value:10  done:false
console.log(itor.next()); //value:10 done:false
console.log(itor.next()); //value:20  done:false
console.log(itor.next()); //value:20 done:false
console.log(itor.next()); //value:undefined done:true 
````

### async/await
+ async/await就是generator+promise的语法糖
````
generator+promise实现async/await:
function asyncFunction(generator, ...params) {
    return new Promise(resolve, reject) {
        let itor = generator(...params);
        
        const next = x => {
            let {done, value} = itor.next(x);
            
            if (done) {
                resolve(value);
                return;
            } 
            
            if (!isPromise(value)) value = Promise.resolve(value);
            
            value.then(result => next(result)).catch(reason => reject(reason));
        }
    };
    next();
}
asyncFunction(function* generator() {
    let result = yeild query(1);
    result = yeild query(2);
    result = yeild query(3);
}.then(() => {
// generator函数中所以内容都执行完
    console.log('都成功了');
}).catch(() => {
// generator函数中出现问题
}))
````
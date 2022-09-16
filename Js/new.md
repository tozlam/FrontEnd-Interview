# new流程


````
手撕NEW的源码(NEW执行的原理) Ctor->constructor
    创建当前类的一个空实例对象
     + 空对象
     + 实例对象.__proto__===Ctor.prototype
    把构造函数当做普通函数一样执行
    让方法执行的时候，方法中的this指向这个实例对象「this.xxx=xxx就是在给实例对象设置私有的属性和方法」
    看方法的返回结果 如果没有返回值/或者返回的是原始值，我们默认都返回实例对象；返回的如果是对象类型，则以用户自己手动返回的为主；
 
function myNew(Ctor, ...params) {
    let obj = Object.create(Ctor.prototype); 
    // Object.create(A)：创建一个空的对象并把A作为新对象的原型（新对象.__proto__ === A）; A只能是null或者是对象类型
    let result = Ctor.call(obj, ...params);
    if (result && (typeof result === "object" || typeof result === "function")) {
        return result
    }
    return obj;
}

创建新对象并设置原型
绑定this并执行
根据结果返回result或者新对象

````
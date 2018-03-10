# call、apply、bind

# call、apply
## 例子
      function cat(){}
      cat.prototype={     
        food:"fish",     
        say: function(){           
            alert("I love "+this.food);     
            }
      }
      var blackCat = new cat;blackCat.say();
但是如果我们有一个对象whiteDog = {food:"bone"},我们不想对它重新定义say方法，<br>
那么我们可以通过call或apply用blackCat的say方法：blackCat.say.call(whiteDog)。<br>
所以，可以看出call和apply是为了动态改变this而出现的，当一个object没有某个方法，但是其他的有，我们可以借助call或apply用其它对象的方法来操作。

## 概念
call 和 apply 都是为了改变某个函数运行时的 context 即上下文而存在的，换句话说，就是为了动态改变函数体内部 this 的指向。<br>
因为 JavaScript 的函数存在「定义时上下文」和「运行时上下文」以及「上下文是可以改变的」这样的概念。<br>
二者的作用完全一样，只是接受参数的方式不太一样。唯一区别是apply接受的是数组参数，call接受的是连续参数。

#### 函数调用的三种方式:
- 1 obj.myFunc();
- 2 myFunc.call(obj,arg1,arg2);
- 3 myFunc.apply(obj,[arg1,arg2]);

其中 obj(即this) 是你想指定的上下文，他可以任何一个 JavaScript 对象(JavaScript 中一切皆对象)。如果写的是null，那么this指向的是window对象<br>
call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里。

#### 口诀
    猫吃鱼，狗吃肉，奥特曼打小怪兽。

    有天狗想吃鱼了

    猫.吃鱼.call(狗，鱼)

    狗就吃到鱼了

    猫成精了，想打怪兽

    奥特曼.打小怪兽.call(猫，小怪兽)

````
var a = {
    user:"tozlam",
    fn:function(arg1,arg2){
        console.log(this.user); //tozlam
        console.log(arg1+arg2); //3
    }
}
var b = a.fn;
b.call(a,1,2);


var a = {
    user:"tozlam",
    fn:function(arg1,arg2){
        console.log(this.user); //tozlam
        console.log(arg1+arg2); //3
    }
}
var b = a.fn;
b.apply(a,[1,2]);
````

# bind
bind()和call与apply不同。bind是新创建一个函数，然后把它的上下文绑定到bind()括号中的参数上，然后将它返回。

所以，bind后函数不会执行，而只是返回一个改变了上下文的函数副本，而call和apply是直接执行函数。
````
var a = {
    user:"tozlam",
    fn:function(){
        console.log(this.user);
    }
}
var b = a.fn;
b.bind(a);

````
我们发现代码没有被打印，对，这就是bind和call、apply方法的不同，实际上bind方法返回的是一个修改过后的函数。
````
var a = {
    user:"tozlam",
    fn:function(e,d,f){
        console.log(this.user); //tozlam
        console.log(e,d,f); //10 1 2
    }
}
var b = a.fn;
var c = b.bind(a,10);
c(1,2);
````
# 总结
call和apply都是改变上下文中的this并立即执行这个函数，bind方法可以让对应的函数想什么时候调就什么时候调用，并且可以将参数在执行的时候添加，这是它们的区别，根据自己的实际情况来选择使用。
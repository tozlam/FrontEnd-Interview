# call、apply
      function cat(){}cat.prototype={     
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

其中 obj(即this) 是你想指定的上下文，他可以任何一个 JavaScript 对象(JavaScript 中一切皆对象)，<br>
call 需要把参数按顺序传递进去，而 apply 则是把参数放在数组里。

#### 口诀
    猫吃鱼，狗吃肉，奥特曼打小怪兽。

    有天狗想吃鱼了

    猫.吃鱼.call(狗，鱼)

    狗就吃到鱼了

    猫成精了，想打怪兽

    奥特曼.打小怪兽.call(猫，小怪兽)
# Array数组
- ECMAScript数组的大小是可以动态调整的，即可以随着数据的增加自动增长以容纳新增数据

## 创建方式
#### 1. 使用Array构造函数
````
    var colors=new Array();
    var colors=new Array(20);
    var colors=new Array("red","blue");
    
    //省略new操作符结果相同
    var colors=Array(20);
     var colors=Array("red","blue");
 ````
 #### 2. 字面量表示法
 ````
    var colors=["red","blue"];
    var colors=[];
   ````
 ## 方法
 ### 添加
 1. 利用length属性
 ````
     var colors=["red","blue","green"];
     colors.lengtg=4;
     alert(colors[3]);                  //undefined


    colors[99]="black";
    alert(colors.length);               //100【长度值等于最后一项索引加1】(colors[3]到colors[98)的值都是undefinded）
 ````
 2. 栈方法
 - ECMAScript为数组提供push()、pop()方法 以提供类似栈的行为
 - push()方法可以接收任意数量的参数，把他们`逐个加到数组末尾`，并`返回修改后的数组的长度`
 ````
    var colors=new Array();
    var count=colors.push("red","green");
 ````
- 可以将栈方法与其他数组方法连用
```
    var colors=["red","green"];
    colors.push("blue");
    colors[3]="black";
    alert(color.length);   //4
```

3. 队列方法
- ECMAScript为数组提供了一个unshift()方法。unshift()与shift()用途相反；它能在数组前端添加任意个项并返回新的数组长度。
````
    var colors=new Array(;
    var count=colors.unshift("red","green");
    count=colors.unshift("black");                  //数组中各项顺序为："black","red","green"
    
````
4. splice()方法
- 可以向指定位置插入任意数量的项，只需提供3个参数：起始位置、0（要删除的项数）和要插入的项。如果要插入多个项，可以再传入第四、第五，以至任意多个项。
 ````
    var colors=["red","green"];
    var removed=colors.splice(1,0,"blue","orange");    //colors包含"red","blue","orange","green"
    alert(removed);                                    //返回的是一个空数组
 ````
 
 ## 删除
 1. 利用length属性
 - 数组的length属性不只是只读的。因此，通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项。
 ````
    var colors=["red","green","blue"];
    colors.length=2;
    alert(colors[2]);                   //undefined
    colors[colors.length]="black";      //向数组末尾添加新项
 ````
 
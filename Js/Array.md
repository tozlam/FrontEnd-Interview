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
- splice()方法可以向指定位置插入任意数量的项，只需提供3个参数：起始位置、0（要删除的项数）和要插入的项。如果要插入多个项，可以再传入第四、第五，以至任意多个项。
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
 2. 栈方法
 - pop()方法从数组末尾移除最后一项，减少数组的length值，然后返回移除的项。
 ````
    var colors=["red","blue"];
    var item=colors.pop();
    alert(item);                    //"blue"
 ````
 3. 队列方法
 - shift()方法能够移除数组中第一项并返回该项，同时数组长度减1。
 ````
    var colors=["red","blue"];
    var item = colors.shift();
    alert(item);                //"blue"
 ````
 4. splice()方法
 - splice()方法可以删除任意数量的项，只需指定两个参数：要删除的第一个项位置和要删除的项数。
 - splice()方法可以指定位置插入任意数量的项，且同时删除任意数量的项，只需指定3个参数：起始位置、要删除的项数和要插入的任意数量的项。<br>
 插入的项数不必与删除的项数相等。
 - splice()方法始终返回一个数组，该数组中包含从原始数组中删除的项。
 ````
 //删除
    var colors=["red","green"];
    var removed=colors.splice(0,1);
    alert(removed);                 //"red"
    alert(colors);                  //"green"
  
  //替换
  var colors=["red","green"];
      var removed=colors.splice(1,1,"blue","black");
      alert(removed);                 //"green"
      alert(colors);                  //"red","blue","black"
  ````
  
  
  
  ## 排序
  1. reverse()方法
  - reverse()方法反转数组项的顺序
  ````
    var colors=["red","green","blue"];
    colors.reverse();
    alert(colors);                  //"blue","green","red"
  ````
  2. sort()方法
  - 默认情况下，sort()方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。
  - 为了实现排序，sort()方法会调用每个数组项的toString()转型方法，然后比较得到的字符串，以确定如何排序。<br>
  即使数组中的每一项都是数值，sort()方法比较的也是字符串。
  ````
    var values=[0,1,5,10,15];
    values.sort();
    alert(values);              //0,1,10,15,5    【因为比较的是字符串"10"在"5"之前】
  ````
  - sort()方法还可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值前面
  ````
    function compare(value1,value2){
        if(value1 < value2){ return 1;}            //第一个参数应该位于第二个参数之后则返回1     
        else if(value1 > value2){ return -1;}       //第一个参数应该在第二个参数之前则返回-1
        else{ return 0;}                            
     }
     var values=[0,1,5,10,15];
     values.sort(compare);
     alert(values);        //15,10,5,1,0            
  ````
  - 对于数值类型或者其valueOf()方法会返回数值类型对象类型，可以使用一个更简单比较函数。这个函数只要用第二个值减第一个值即可。
  ````
    function compare(value1,value2){
    return value2-value1;
    }
  ````
  
  ## 转换
  - 调用数组的toString()方法会返回由数组中每个值字符串形式拼接而成的一个以逗号分隔的字符串。
  - 调用数组的valueOf()返回的还是数组。
  - 调用数组的toLocaleString()方法也会创建一个数组值的以逗号分隔的字符串。与之前两个方法的唯一不同之处在于：为了取得每一项的值，调用是每一项的toLocaleString()方法，而不是toString()方法。
  
 
  
  
        
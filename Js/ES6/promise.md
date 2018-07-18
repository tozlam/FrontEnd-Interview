# Promise
###### 整理自：https://segmentfault.com/a/1190000011652907
## 用途
解决回调函数的嵌套，也就是所谓的回调地狱
````
//回调地狱（多层嵌套）
doSomethingA((res) =>{if (res.data) {
    doSomethingB(res.data, (resB) => {
      if (resB.data) {
        doSomethingC(resB.data)
      }
    })
  }})

````

## 含义
Promise 对象用于一个异步操作的最终完成（或失败）及其结果值的表示。<br>
简单点说，它就是用于处理异步操作的，异步处理成功了就执行成功的操作，异步处理失败了就捕获错误或者停止后续操作。

它的一般表示形式为：
````
new Promise(
    /* executor */
    function(resolve, reject) {
        if (/* success */) {
            // ...执行代码
            resolve();
        } else { /* fail */
            // ...执行代码
            reject();
        }
    }
);
````
其中，Promise中的参数executor是一个执行器函数，它有两个参数resolve和reject。<br>
它内部通常有一些异步操作，如果异步操作成功，则可以调用resolve()来将该实例的状态置为fulfilled，即已完成的，如果一旦失败，可以调用reject()来将该实例的状态置为rejected，即失败的。

我们可以把Promise对象看成是一条工厂的流水线，对于流水线来说，从它的工作职能上看，它只有三种状态，一个是初始状态（刚开机的时候），一个是加工产品成功，一个是加工产品失败（出现了某些故障）。<br>
同样对于Promise对象来说，它也有三种状态：

- pending

初始状态,也称为未定状态，就是初始化Promise时，调用executor执行器函数后的状态。
- fulfilled

完成状态，意味着异步操作成功。
- rejected

失败状态，意味着异步操作失败。

它只有两种状态可以转化，即

- 操作成功

pending -> fulfilled
- 操作失败

pending -> rejected

并且这个状态转化是单向的，不可逆转，已经确定的状态（fulfilled/rejected）无法转回初始状态（pending）。

## 方法
### Promise.prototype.then()
Promise对象含有then方法，then()调用后返回一个`新的`Promise实例，意味着实例化后的Promise对象可以进行链式调用，而且这个then()方法可以接收两个函数，一个是处理成功后的函数，一个是处理错误结果的函数。

如下：
````
var promise1 = new Promise(function(resolve, reject) {
  // 2秒后置为接收状态
  setTimeout(function() {
    resolve('success');
  }, 2000);
});

promise1.then(function(data) {
  console.log(data); // success
}, function(err) {
  console.log(err); // 不执行
}).then(function(data) {
  // 上一步的then()方法没有返回值
  console.log('链式调用：' + data); // 链式调用：undefined 
}).then(function(data) {
  // ....
});
````
在这里我们主要关注promise1.then()方法调用后返回的Promise对象的状态，是pending还是fulfilled，或者是rejected?

返回的这个Promise对象的状态主要是根据promise1.then()方法返回的值，大致分为以下几种情况：

- 如果then()方法中返回了一个参数值，那么返回的Promise将会变成接收状态。
- 如果then()方法中抛出了一个异常，那么返回的Promise将会变成拒绝状态。
- 如果then()方法调用resolve()方法，那么返回的Promise将会变成接收状态。
- 如果then()方法调用reject()方法，那么返回的Promise将会变成拒绝状态。
- 如果then()方法返回了一个未知状态(pending)的Promise新实例，那么返回的新Promise就是未知状态。
- 如果then()方法没有明确指定的resolve(data)/reject(data)/return data时，那么返回的新Promise就是接收状态，可以一层一层地往下传递。

转换实例如下：
````
var promise2 = new Promise(function(resolve, reject) {
  // 2秒后置为接收状态
  setTimeout(function() {
    resolve('success');
  }, 2000);
});

promise2
  .then(function(data) {
    // 上一个then()调用了resolve，置为fulfilled态
    console.log('第一个then');
    console.log(data);
    return '2';
  })
  .then(function(data) {
    // 此时这里的状态也是fulfilled, 因为上一步返回了2
    console.log('第二个then');
    console.log(data);  // 2

    return new Promise(function(resolve, reject) {
      reject('把状态置为rejected error'); // 返回一个rejected的Promise实例
    });
  }, function(err) {
    // error
  })
  .then(function(data) {
    /* 这里不运行 */
    console.log('第三个then');
    console.log(data);
    // ....
  }, function(err) {
    // error回调
    // 此时这里的状态也是fulfilled, 因为上一步使用了reject()来返回值
    console.log('出错：' + err); // 出错：把状态置为rejected error
  })
  .then(function(data) {
    // 没有明确指定返回值，默认返回fulfilled
    console.log('这里是fulfilled态');
});
````
### Promise.prototype.catch()
catch()方法和then()方法一样，都会返回一个新的Promise对象。
它是.then(null,rejection)的别名，它主要用于捕获异步操作时出现的异常。因此，我们通常省略then()方法的第二个参数，把错误处理控制权转交给其后面的catch()函数，如下：
````
var promise3 = new Promise(function(resolve, reject) {
  setTimeout(function() {
    reject('reject');
  }, 2000);
});

promise3.then(function(data) {
  console.log('这里是fulfilled状态'); // 这里不会触发
  // ...
}).catch(function(err) {
  // 最后的catch()方法可以捕获在这一条Promise链上的异常
  console.log('出错：' + err); // 出错：reject
});
````
· 如果Promise状态已经变成Resolved，再抛出的错误是无效的，并不会捕获。

· Promise对象的错误具有“冒泡”的性质，会一直向后传递，直到被捕获为止。

### Promise.all()
Promise.all()接收一个参数，它`必须是可以迭代的`，比如数组。

它通常用来处理一些并发的异步操作，即它们的结果`互不干扰`，但是又需要异步执行。它最终只有两种状态：成功或者失败。

它的状态受参数内各个值的状态影响，即`里面状态全部为fulfilled时，它才会变成fulfilled，否则变成rejected`。

成功调用后返回一个数组，数组的值是有序的，即按照传入参数的数组的值操作后返回的结果。如下：
````
// 置为fulfilled状态的情况
var arr = [1, 2, 3];
var promises = arr.map(function(e) {
  return new Promise(function(resolve, reject) {
    resolve(e * 5);
  });
});

Promise.all(promises).then(function(data) {
    // 有序输出
  console.log(data); // [5, 10, 15]
  console.log(arr); // [1, 2, 3]
});

// 置为rejected状态的情况
var arr = [1, 2, 3];
var promises2 = arr.map(function(e) {
  return new Promise(function(resolve, reject) {
    if (e === 3) {
      reject('rejected');
    }
    resolve(e * 5);
  });
});

Promise.all(promises2).then(function(data) {
  // 这里不会执行
  console.log(data);
  console.log(arr);
}).catch(function(err) {
  console.log(err); // rejected
});
````
### Promise.race()
Promise.race()和Promise.all()类似，都接收一个可以迭代的参数，但是不同之处是Promise.race()的状态变化不是全部受参数内的状态影响，一旦参数内有一个值的状态发生的改变，那么该Promise的状态就是改变的状态。就跟race单词的字面意思一样，谁跑的快谁赢。如下：
````
var p1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 300, 'p1 doned');
});

var p2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 50, 'p2 doned');
});

var p3 = new Promise(function(resolve, reject) {
  setTimeout(reject, 100, 'p3 rejected');
});

Promise.race([p1, p2, p3]).then(function(data) {
  // 显然p2更快，所以状态变成了fulfilled
  // 如果p3更快，那么状态就会变成rejected
  console.log(data); // p2 doned
}).catch(function(err) {
  console.log(err); // 不执行
});
````
### Promise.resolve()
Promise.resolve()接受一个参数值，可以是普通的值，具有then()方法的对象和Promise实例。正常情况下，它返回一个Promise对象，状态为fulfilled。但是，当解析时发生错误时，返回的Promise对象将会置为rejected态。如下：
````
// 参数为普通值
var p4 = Promise.resolve(5);
p4.then(function(data) {
  console.log(data); // 5
});


// 参数为含有then()方法的对象
var obj = {
  then: function() {
    console.log('obj 里面的then()方法');
  }
};

var p5 = Promise.resolve(obj);
p5.then(function(data) {
  // 这里的值时obj方法里面返回的值
  console.log(data); // obj 里面的then()方法
});


// 参数为Promise实例
var p6 = Promise.resolve(7);
var p7 = Promise.resolve(p6);

p7.then(function(data) {
  // 这里的值时Promise实例返回的值
  console.log(data); // 7
});

// 参数为Promise实例,但参数是rejected态
var p8 = Promise.reject(8);
var p9 = Promise.resolve(p8);

p9.then(function(data) {
  // 这里的值时Promise实例返回的值
  console.log('fulfilled:'+ data); // 不执行
}).catch(function(err) {
  console.log('rejected:' + err); // rejected: 8
});
````
### Promise.reject()
Promise.reject()和Promise.resolve()正好相反，它接收一个参数值reason，即发生异常的原因。此时返回的Promise对象将会置为rejected态。如下：
````
var p10 = Promise.reject('手动拒绝');
p10.then(function(data) {
  console.log(data); // 这里不会执行，因为是rejected态
}).catch(function(err) {
  console.log(err); // 手动拒绝
}).then(function(data) {
 // 不受上一级影响
  console.log('状态：fulfilled'); // 状态：fulfilled
});
````
总之，除非Promise.then()方法内部抛出异常或者是明确置为rejected态，否则它返回的Promise的状态都是fulfilled态，即完成态，并且它的状态不受它的上一级的状态的影响。

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

Promise的缺点：
● 无法取消Promise，一旦新建它就会立即执行，无法中途取消。
● 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。
● 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

注意：在构造 Promise 的时候，构造函数内部的代码是立即执行的

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

https://promisesaplus.com/
````
简单版promise实现：

(function Promise(execute) {
    var self = this, timer = null;
    
    if (typeof execute !== 'function') throw new TypeError();
    if (!(self instanceof Promise)) throw new TypeError();
    
    self.state = 'pending';
    self.value = undefined;
    self.onreslovedCallback = [];
    self.onrejectedCallback = [];
    
    // 状态改变的事件
    var change = function change (state, value) {
        if (self.state !== 'pending') return
        self.state = state;
        self.value = value;
        
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            
            var callbacks = state === 'fulfilled' ? self.onreslovedCallback : self.onrejectedCallback;
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](value);
            }
        })
        
    }
    
    var resloved = function resloved(result) {
        change('fulfilled', result);
    }
    var rejected = function resloved(reason) {
        change('rejected', reason);
    }
    
    try {
        execute(resloved, rejected)
    } catch (reason) {
        change('rejected', reason);
 }
 
 Promise.prototype = {
    constructor: Promise,
    // 执行THEN的时候，如果知道了实例状态，直接执行「不是立即的，也是一个异步微任务」对应的方法
    // 此时还不知道实例的状态，则先把方法存储取来，等到后期知道状态的时候「resolve/reject执行」，再通知之前存储的方法执行即可「异步微任务」
    then: function then(onresolved, onrejected) {
        var self = this, timer = null;
        switch(self.state) {
            // 已明确状态是fulfilled的情况下
            case 'fulfilled':
                timer = setTimeout(() => { // 做异步处理
                    clearTimeout(timer);
                    timer = null;
                    onresolved(self.value);
                })
                break;
            case 'rejected':
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    timer = null;
                    onrejected(self.value);
                })
                break;
            default: // 不确定状态的时候先将onresolved和onrejected存储起来 供以后更新状态时使用
                self.onresolvedCallback.push(onresolved);
                self.onrejectedCallback.push(onrejected);
                break;
        }
    },
    catch: () => {},
 }
 if (typeof Symbol !== 'undefined') {
    Promise.prototype[Symbol.toStringTag] = 'Promise';// 为Object.toString.call检测类型提供结果
 }

 // 暴露API
 if (typeof window !== "undefined") window.Promise = Promise;
 if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();


promise+then链的实现：
(function Promise(execute) {
    var self = this, timer = null;
    
    if (typeof execute !== 'function') throw new TypeError();
    if (!(self instanceof Promise)) throw new TypeError();
    
    self.state = 'pending';
    self.value = undefined;
    self.onresolvedCallback = [];
    self.onrejectedCallback = [];
    
    // 状态改变的事件
    var change = function change (state, value) {
        if (self.state !== 'pending') return
        self.state = state;
        self.value = value;
        
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            
            var callbacks = state === 'fulfilled' ? self.onresolvedCallback : self.onrejectedCallback;
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i](value);
            }
        })
       
    }
    
    var resolved = function resolved(result) {
        change('fulfilled', result);
    }
    var rejected = function resolved(reason) {
        change('rejected', reason);
    }
    
    try {
        execute(resolved, rejected)
    } catch (reason) {
        change('rejected', reason);
 }
 
 function resolvePromise(promise, x, resolve, reject) {
    // promise: 每一次then要返回的实例
    // x: onfulfilled/onrejected返回的结果
    // resolve/reject: 这两个执行可以决定promise是成功或者失败
    
     // x不能跟promise是同一个
     if (x === promise) throw new TypeError('Chaining cycle detected for promise #<Promise>');
     
     // 如果x是object或者function
     if (/^(object|function)$/i.test(typeof x)) {
        var then;
        try {
            then = x.then
        }catch(err) {
            reject(err);
        }
        
        // 如果x.then是个函数(代表x.then是个promise类型的)
        if (typeof then === 'function') {
            var called = false; // 防抖
            try {
                // x.then()
                then.call(x, function onfulfilled(y) {
                    if (called) return
                    called = true;
                    // 递归 （因为x.then是个promise，所以要等他执行完返回状态后才能返回成功或失败）
                    resolvePromise(promise, y, resolve, reject);
                }, function onrejected(r) {
                    if (called) return
                    called = true;
                    reject(r);
                })
            }catch(err) {
                if (called) return
                reject(err);
            }
        }
     }
     resolve(x);
 }
 
 
 Promise.prototype = {
    constructor: Promise,
    // 执行THEN的时候，如果知道了实例状态，直接执行「不是立即的，也是一个异步微任务」对应的方法
    // 此时还不知道实例的状态，则先把方法存储取来，等到后期知道状态的时候「resolve/reject执行」，再通知之前存储的方法执行即可「异步微任务」
    then: function then(onfulfilled, onrejected) {
        var self = this, timer = null, promise;
        
        // 如果不是传的函数则变成函数，顺延操作
        if (typeof onfulfilled !== 'function') {
            onfulfilled = function onfulfilled (result) {
                return result;
            }
        }
        if (typeof onrejected !== 'function') {
            onrejected = function onfulfilled (reason) {
                throw reason;
            }
        }
        
        // promise是返回的新实例，执行reslove/reject控制他的状态和结果；但是具体执行哪个方法由onfulfilled/onrejected执行决定(是否报错、是否返回新的promise实例)
        promise = new Promise(function(resolve,reject) {
             switch(self.state) {
                // 已明确状态是fulfilled的情况下
                case 'fulfilled':
                    timer = setTimeout(() => { // 做异步处理
                        clearTimeout(timer);
                        timer = null;
                        try {
                            var x = onfulfilled(self.value);
                            resolvePromise(promise, x, resolve, reject);
                        } catch(err) {
                            reject(err)
                        }
                    })
                    break;
                case 'rejected':
                    timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        try {
                            var x =  onrejected(self.value);
                            resolvePromise(promise, x, resolve, reject);
                        } catch(err) {
                            reject(err)
                        }
                      
                    })
                    break;
                default: 
                // 向集合中存储的是一个匿名函数，后期change方法执行时先把匿名函数执行，再执行onfulfilled（监听是否报错及返回值）
                    self.onresolvedCallback.push(function(result) {
                       try {
                            var x = onfulfilled(result);
                            resolvePromise(promise, x, resolve, reject);
                        } catch(reason) {
                            reject(reason)
                        }
                    });
                    self.onrejectedCallback.push(function(reason) {
                       try {
                            var x = onrejected(reason);
                            resolvePromise(promise, x, resolve, reject);
                        } catch(err) {
                            reject(err)
                        }
                    });
                    break;
            }
        });
        return promise;
    },
    catch: function myCatch(onrejected) {
        return this.then(null, onrejected)
    },
 }
 if (typeof Symbol !== 'undefined') {
    Promise.prototype[Symbol.toStringTag] = 'Promise';// 为Object.toString.call检测类型提供结果
 }
 
 // 判断是否是promise类型的
 function isPromise(x) {
    if (x !== null && /^(object|function)$/i.test(typeof x)) {
        if(typeof x.then === 'function') {
            return true;
        }
    }
    return false;
 }
 
 Promise.resolve = function resolve(result) {
    return new Promise(function (result) {
        resolve(result);
    })
 };
 Promise.reject = function reject(reason) {
    return new Promise(function (reason) {
        reject(reason);
    })
 };
 Promise.all = function all(promises) {
    var n = 0, results = [];
    if (!Array.isArray(promises)) throw new TypeError();
    
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++){
            (function(i) {
                var promise = promises[i];
                
                // 如果这一项不是promise类型的时候就把他变成promise类型的
                if (!isPromise(promise)) {
                    promise = Promise.resolve(promise);
                }
                
                promise.then(function(result) {
                    n++;
                    results[i] = result;
                    if (n >= promises.length) resolve(results);
                }).catch(reason) {
                    reject(reason);
                }
            })(i);
        }  
    })
    
 }

 // 暴露API
 if (typeof window !== "undefined") window.Promise = Promise;
 if (typeof module === "object" && typeof module.exports === "object") module.exports = Promise;
})();
````

````
Promise A+ 测试

安装promises-aplus-tests

npm install promises-aplus-tests --save-dev
手写代码中加入 deferred

Promise.deferred = function () {
var result = {};
result.promise = new Promise(function (resolve, reject) {
result.resolve = resolve;
result.reject = reject;
});
return result;
}
配置启动命令

{
"scripts": {
"test": "promises-aplus-tests MyPromise.js"
},
......
}
开启测试

npm run test
````

````
题目. 设计一个简单的任务队列，要求分别在1,3,4秒后打印出”1“，”2“，”3“
  new Quene()
  .task(1000, () => {
  console.log(1)
  })
  .task(2000, () => {
  console.log(2)
  })
  .task(1000, () => {
  console.log(3)
  })
  .start()

  function Quene() { ... }
  
  
解： 
  function Quene() {
    this.queneList = [];
  }
  Quene.prototype.task = function (time, callback) {
    this.queneList.push({time, callback});
  }
  Quene.prototype.start = function () {
    let result = Promise.resolve();
    this.queneList.forEach(item => {
        result = result.then(() => {
            return new Promise((resolve, reject) => {
                 setTimeout(() => {
                    resolve(item.callback());
                }, item.time)
            })
        })
    })
  }

````

#### async/await对比Promise的优势
● 代码读起来更加同步，Promise虽然摆脱了回调地狱，但是then的链式调⽤也会带来额外的阅读负担
● Promise传递中间值⾮常麻烦，⽽async/await⼏乎是同步的写法，⾮常优雅
● 错误处理友好，async/await可以⽤成熟的try/catch，Promise的错误捕获⾮常冗余
● 调试友好，Promise的调试很差，由于没有代码块，你不能在⼀个返回表达式的箭头函数中设置断点，如果你在⼀个.then代码块中使⽤调试器的步进(step-over)功能，
调试器并不会进⼊后续的.then代码块，因为调试器只能跟踪同步代码的每⼀步。 
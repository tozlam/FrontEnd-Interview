# Promise
###### 整理自：https://segmentfault.com/a/1190000011652907
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

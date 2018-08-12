# Node

+ node的核心模块：EventEmitter, Stream, FS, Net和全局对象
+ node有哪些全局对象? process, console, Buffer



# Process进程
+ process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。 因为是全局变量，所以无需使用 require()。
### exit事件
 两种情况exit会被触发：
 - 显式调用 process.exit() 方法，使得 Node.js 进程即将结束；
 - Node.js 事件循环数组中不再有额外的工作，使得 Node.js 进程即将结束。

在上述两种情况下，没有任何方法可以阻止事件循环的结束，一旦所有与 'exit' 事件绑定的监听器执行完成，Node.js 的进程会终止。

+ exit事件监听器的回调函数，只允许包含同步操作。所有监听器的回调函数被调用后，任何在事件循环数组中排队的工作都会被强制丢弃，然后 Nodje.js 进程会立即结束。 例如在下例中，定时器中的操作永远不会被执行（因为不是同步操作）。
````
process.on('exit', (code) => {
  setTimeout(() => {
    console.log('该函数不会被执行');
  }, 0);
});
````
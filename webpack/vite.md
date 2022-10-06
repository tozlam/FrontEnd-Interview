### 打包原理比较
<table>
<th></th>
<th>打包过程</th>
<th>原理</th>
<tr>
<td>webpack</td>
<td>识别入口->逐层识别依赖->分析/转换/编译/输出代码->打包后的代码	</td>
<td>逐级递归识别依赖，构建依赖图谱->转化AST语法树->处理代码->转换为浏览器可识别的代码</td>
</tr>
<tr>
<td>vite</td>
<td>-</td>
<td>基于浏览器原生 ES module，利用浏览器解析 imports，服务器端按需编译返回</td>
</tr>
</table>

+ webpack会先打包，然后启动开发服务器，请求服务器时直接给予打包结果。 而vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。（由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。）
+ 由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。
+ 在HMR（热更新）方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
+ 当需要打包到生产环境时，vite使用传统的rollup（也可以自己手动安装webpack来）进行打包，因此，vite的主要优势在开发阶段。另外，由于vite利用的是ES Module，因此在代码中（除了vite.config.js里面，这里是node的执行环境）不可以使用CommonJS

### vite原理简述
声明 script 标签类型为 module
````
<script type="module" src="/src/main.js"></script>
````
浏览器向服务器发起GET
````
// 请求main.js文件：
http://localhost:3000/src/main.js

// /src/main.js:
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
````
+ 请求到main.js文件，检测内部含有import引入的包，会对内部的 import 引用发起 HTTP 请求获取模块的内容文件
+ 劫持浏览器的http请求，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器(整个过程没有对文件进行打包编译)

### vite的改进点
<table> 
  <thead> 
   <tr> 
    <th>webpack缺点</th> 
    <th>vite改进点</th> 
   </tr> 
  </thead> 
  <tbody> 
   <tr> 
    <td>服务器启动缓慢</td> 
    <td>将应用模块区分为依赖 和 源码 两类;使用esbuild构建;在浏览器请求源码时进行转换并按需提供源码</td> 
   </tr> 
   <tr> 
    <td>基于nodejs</td> 
    <td>esbuild(Go 编写) 预构建依赖，比node快 10-100 倍</td> 
   </tr> 
   <tr> 
    <td>热更新效率低下;编辑单个文件会重新构建整个包;HMR 更新速度随规模增大下降</td> 
    <td>HMR基于原生 ESM 上，更新速度与应用规模无关;利用http2的缓存+压缩优势</td> 
   </tr> 
  </tbody> 
 </table>
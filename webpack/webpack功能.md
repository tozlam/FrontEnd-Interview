# Webpack核心功能

## webpack原理
最简单地说，就是分析代码，找到require、exports、define等“关键词”，并替换成对应模块的“引用”

## webpack作用
分析项目结构，找到js模块以及其他的一些浏览器不能直接运行的拓展语言，并将其转换和打包为合适的格式供浏览器使用。

## webpack过程
````
流程可以大致划分为 以下7个阶段

1-初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数

2-开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译

3-确定入口：根据配置中的 entry 找出所有的入口文件

4-编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

5-完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

6-输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件>加入到输出列表，这步是可以修改输出内容的最后机会

7-输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
````

## webpack核心功能
1. 依赖管理：方便引用第三方模块、让模块更容易复用、避免全局注入导致的冲突、避免重复加载或加载不需要的模块。
2. 合并代码：把各个分散的模块集中打包成大文件，减少HTTP的请求链接数，配合UglifyJS可以减少、优化代码的体积。
3. 各路插件：babel把ES6+转译成ES5-，eslint可以检查编译期的错误

## webpack的能力：
+ 编译代码能力，提高效率，解决浏览器兼容问题
+ 模块整合能力，提高性能，可维护性，解决浏览器频繁请求文件的问题
+ 万物皆可模块能力，项目维护性增强，支持不同种类的前端模块类型，统一的模块化方案，所有资源文件的加载都可以通过代码控制


## loader和plugin
+ loader是专门把其他类型的文件转换成webpack能认识的类型（js/json）
+ Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
+ loader处理顺序是从右向左 从下往上
+ loader 运行在打包文件之前
+ 常见的loader：
    + css-loader是把js中的css文件翻译成webpack能认识的文件（加载 CSS，支持模块化、压缩、文件导入等特性）
    + style-loader是把能认识的css文件变成真正起作用的代码 （把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS）
    + babel-loader：主要是把高版本js转化成大部分浏览器能支持的语法（把 ES6 转换成 ES5）
    + file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)
    + url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件base64 形式编码 (处理图片和字体)
  
+ Plugin 就是插件，可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
+ Plugin 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。
+ plugins 在整个编译周期都起作用
+ webpack常用插件：
  + cleanWebpackPlugin： 在为生产环境编译文件的时候，先把 build或dist (就是放生产环境用的文件) 目录里的文件先清除干净，再生成新的
  + webpack.definePlugin: 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
  + webpack-merge：合并配置文件
  + HtmlWebpackPlugin：设置渲染页面的模板，该插件将为你生成一个 HTML5 文件
  + terser-webpack-plugin: 支持压缩 ES6 (Webpack4)
  
## webpack优化
+ 压缩代码
  1. 压缩js和css， webpack默认不会压缩css，一旦开启css压缩则js就不会自动压缩了。 css-minimizer-webpack-plugin压缩css， terser-webpack-plugin压缩js；
  ````
    // webpack.config.js
     optimization{
        minimizer: [
          new cssMinimizerWebpackPlugin(),
          new terser()
        ]
     }
  ````
+ 缩小打包作用域：
  2. exclude 排除那些不用解析的文件 /node_modules/
  3. noParse 就是告诉webpack不去解析这些包的依赖 (使用这个优化项我们需要知道哪些包没有另外的依赖 /jquery|lodash/)
  ````
  // webpack.config.js
  module: {
    noParse: /lodash/, // 当解析lodash的时候不去解析lodash的依赖
  }
  ````
  4. alias 指定通配符，可以提升文件的查找速度，也就是可以提升webpack的编译性能
  ````
  // webpack.config.js
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }

  ````
  5. extensions 可以在引入某些文件的时候省略文件的后缀
  ````
  // webpack.config.js
  resolve: {
    extensions: ['.js', '.json']
  }
  ````
  6. webpack.IgnorePlugin 忽略某些包中不必要的文件
  ````
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/, // 忽略moment.locale
  })
  ````
7. externals: {} 外部扩展 可以让我们通过cdn方式引入一些包 并且在模块中还能正常通过import使用这些包
8. splitChunks 分包
9. thread-loader(新的) happypack(老的) 多进程打包

+ devtool选择
````
开发环境推荐：
cheap-module-eval-source-map
生产环境推荐：
cheap-module-source-map

这也是下版本 webpack 使用 -d 命令启动 debug 模式时的默认选项

原因如下：
使用 cheap 模式可以大幅提高 souremap 生成的效率。大部分情况我们调试并不关心列信息，而且就算 sourcemap 没有列，有些浏览器引擎（例如 v8） 也会给出列信息。
使用 eval 方式可大幅提高持续构建效率。官方文档提供的速度对比表格可以看到 eval 模式的编译速度很快。
使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用）。
使用 eval-source-map 模式可以减少网络请求。这种模式开启 DataUrl 本身包含完整 sourcemap 信息，并不需要像 sourceURL 那样，浏览器需要发送一个完整请求去获取 sourcemap 文件，这会略微提高点效率。而生产环境中则不宜用 eval，这样会让文件变得极大。

sourceMap 本质上是一种映射关系，打包出来的 js 文件中的代码可以映射到代码文件的具体位置,这种映射关系会帮助我们直接找到在源代码中的错误。
打包速度减慢，生产文件变大，所以开发环境使用 sourceMap，生产环境则关闭。
````

+ 如何处理图片
````
比较小的图片可以转成base64的格式，可以减少http请求次数
比较大的图片，通过像file-loader打包到指定的文件夹，发送请求（转成base64的话首次渲染太慢，因为要先转base64）

// webpack.prod.config.js
module: {
  rules: [
    {
      test: /.\(png|jpg)$/,
      use: {
        loader: 'url-loader', // url-loader依赖于file-loader
        options:{
          limit: 5*1024  //如果图片小于5k，就使用base64处理 大于5k则交给file-loader处理
        }
      }
    }
  ]
}

````

+ 抽离css文件
````
使用miniCssExtractPlugin插件

plugin: [
  new MiniCssExtractPlugin({
    filename: 'css/main.[contentHash:8].css',
  })
],
module: {
  rules: [
    {
      test: /\.css$/,
      loader: [
        MiniCssExtractPlugin.loader, // 使用MiniCssExtractPlugin提供的loader替换style-loader
        'css-loader'
      ]
    }
  ]
}
````

+ 抽离公共代码SplitChunk
````
提取公共代码，防止代码被重复打包，拆分过大的js文件，合并零散的js文件

一般有两种情况需要抽离公共代码
1. 公共模块： 公共模块的代码不需要重复打包，单独抽离成一个公共模块的文件，然后引用即可
2. 第三方模块： 第三方模块的代码一般不会改变，不需要在业务代码改变之后重新打包，单独抽离成一个第三方模块的文件，然后引用即可


optimization: {
  splitChunks: {
    chunks: 'all', // 有两种对模块的处理方式： async只对异步代码做分隔 initial只对同步代码做分隔  all: 对同步和异步都做分隔
                   // 同步代码：例如 import lodash from 'lodash'同步引用进来的; 异步代码： 例如import ('lodash')  import函数的形式
    cacheGroup: {
      // 第三方模块
      vendor: {
        name: 'vendor', // 每个组的名字
        priority: 1, // 优先级：优先级越高越先检测处理 （比如lodash他可能被当成第三方模块处理，也可能当成公共模块处理，规定vendor的优先级大于common的优先级，那就先被当第三方模块处理）
        test: /node_modules/, // 检测方法 例如检测模块是否来自node_modules
        minSize: 0, // 设置代码分隔的界限 比如写5*1024，那么大于5kb的代码才会被分隔
        minChunks: 1 // 检测模块被引用了几次 对于第三方模块，大于1次就应该单独打包，公共模块引用大于2次应该单独打包
      },
      // 公共模块
      common: {
        name: 'common',
        priority: 0,
        minSize: 0,
        minChunks: 2
      }
    }
  }
}

HtmlWebpackPlugin配置：

new HtmlWebpackPlugin({
    template: './templete/index.html',
    filename: 'index.html',
    chunks: ['app', 'vendor']   //注入对应的入口js文件、拆包出来的verdor文件（命名跟SplitChunks cacheGroup里配置的名称一致）
}),
new HtmlWebpackPlugin({
    template: './templete/index-no-pb.html',
    filename: 'home.html',
    chunks: ['home', 'vendor']
}),
new HtmlWebpackPlugin({
    template: './templete/index-no-pb.html',
    filename: 'profile.html',
    chunks: ['profile', 'vendor']
}),
...

可以结合vue-router的懒加载使用：import(/* webpackChunkName: "about" */ '../views/About.vue') / import(/* webpackChunkName: "[request]" */`../containers/${pathName}`)
import异步加载的写法实现页面模块lazy loading懒加载（Vue中的路由异步加载）：
Vue中运用import的懒加载语句以及webpack的魔法注释，在项目进行webpack打包的时候，对不同模块进行代码分割，在首屏加载时，用到哪个模块再加载哪个模块，实现懒加载进行页面的优化。


but：每次重新打包，发现vendor的hash也变化了，vendor代码都要刷新，即使我并没有修改其中的代码。这样并不符合我们分开打包的初衷，所以需要DLL
````

+ DLL
````
打包dll的时候，Webpack会将所有包含的库做一个索引，写在一个manifest文件中，而引用dll的代码（dll user）在打包的时候，只需要读取这个manifest文件，就可以了。
这么一来有几个好处：
Dll打包以后是独立存在的，只要其包含的库没有增减、升级，hash也不会变化，因此线上的dll代码不需要随着版本发布频繁更新。
App部分代码修改后，只需要编译app部分的代码，dll部分，只要包含的库没有增减、升级，就不需要重新打包。这样也大大提高了每次编译的速度。
假设你有多个项目，使用了相同的一些依赖库，它们就可以共用一个dll。

// webpack.dll.config.js
var path = require("path");
var webpack = require("webpack");
module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: ['vue/dist/vue.esm.js', 'lodash', 'vuex', 'axios', 'vue-router', 'element-ui']
  },
  output: {
    path: path.join(__dirname, './static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library' 
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library', // 需要和output.library保持一致
      context: __dirname
    }),
  ]
};


// webpack.config.js
plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname, // 与Dllplugin里的context所指向的上下文保持一致，这里都是指向了根目录
      manifest: require('./vendor-manifest.json') //引入Dllplugin所生成的的manifest
    })
  ]

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>dll-test</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./static/js/vendor.dll.js"></script> //需要手动在根目录的index.html里引入所生成的dll库
    <script src="/dist/build.js"></script>
  </body>
</html>

````

+ 那代码分割的本质是什么？有什么意义呢？
````
代码分割的本质其实就是在源代码直接上线和打包成唯一脚本main.bundle.js这两种极端方案之间的一种更适合实际场景的中间状态。

源代码直接上线：虽然过程可控，但是http请求多，性能开销大。
打包成唯一脚本：一把梭完自己爽，服务器压力小，但是页面空白期长，用户体验不好。
````

+ HRM
https://zhuanlan.zhihu.com/p/30669007
![HRM](../img/HRM.jpeg)
````
1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互。
   webpack-dev-middleware 调用 webpack 暴露的 API对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。
   当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端。
   同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5. webpack-dev-server/client端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack。
   webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6. HRM.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JSONP.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值。
   获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。
7. 这一步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。



HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)。
实际上 WDS 与浏览器之间维护了一个 Websocket，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。
客户端对比出差异后(HMR.runtime)会向 WDS 发起 Ajax 请求(通过JSONP.runtime)来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 jsonp 请求获取该chunk的增量更新。
然后HMR将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用（像react-hot-loader 和 vue-loader 都是借助这些 API 实现 HMR）。

基本实现原理大致这样的，构建 bundle 的时候，加入一段 HMR runtime 的 js 和一段和服务沟通的 js 。文件修改会触发 webpack 重新构建，服务器通过向浏览器发送更新消息，浏览器通过 jsonp 拉取更新的模块文件，jsonp 回调触发模块热替换逻辑。
````

+ babel
````
babel 的转译过程也分为三个阶段，这三步具体是：
解析 Parse: 将代码解析⽣成抽象语法树( 即AST )，即词法分析与语法分析的过程
转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在
此过程中进⾏添加、更新及移除等操作
⽣成 Generate: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator
````

+ CSS Modules
+ 可以解决css命名冲突问题
````
首先，CSS Modules 必须通过向 css-loader 传入 modules: true 来开启：

// webpack.config.js
{
  module: {
    rules: [
      // ... 其它规则省略
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启 CSS Modules
              modules: true,
              // 自定义生成的类名
              localIdentName: '[local]_[hash:base64:8]'
            }
          }
        ]
      }
    ]
  }
}
然后在你的 <style> 上添加 module 特性：

<style module>
.red {
  color: red;
}
.bold {
  font-weight: bold;
}
</style>

这个 module 特性指引 Vue Loader 作为名为 $style 的计算属性，向组件注入 CSS Modules 局部对象。然后你就可以在模板中通过一个动态类绑定来使用它了：
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

你也可以通过 JavaScript 访问到它：
<script>
export default {
  created () {
    console.log(this.$style.red)
    // -> "red_1VyoJ-uZ"
    // 一个基于文件名和类名生成的标识符
  }
}
</script>

````
+ vue3的区别
    + https://zhuanlan.zhihu.com/p/350235814
````
1. 按需引用使用的功能模块不再整个引用Vue整个的框架,项目打包时只会打包相应的功能模块应用体积会大大降低
2. 生命周期钩子函数只能在 setup() 期间同步使用
    选项 API 生命周期选项和组合式 API 之间的映射：
    beforeCreate -> use setup()
    created -> use setup()
    beforeMount -> onBeforeMount
    mounted -> onMounted
    beforeUpdate -> onBeforeUpdate
    updated -> onUpdated
    beforeUnmount -> onBeforeUnmount
    unmounted -> onUnmounted
    errorCaptured -> onErrorCaptured
    renderTracked -> onRenderTracked
    renderTriggered -> onRenderTriggered
因为 setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地定义它们
3. 使用compositionAPI，增加setup组件选项，增加ref和reactive进行响应式绑定，watch响应式写法更改，computed()计算属性的变化
4. v-model的改变：总所周知在Vue2.0中v-model只能进行动态绑定value值的变化，
但是在Vue3.0中v-mode可以同时绑定多个不同值的写法为v-model:xxx='变量名'，子组件需要更改绑定的值时需要使用setup函数中的第二个参数进行触发更改方法，写法为context.emit('update:xxx', false)
5. 3.0中 v-if优先级高于v-for
6. 自定义指令的API变更：
    bind → beforeMount 指令绑定到元素后发生。只发生一次。
    inserted → mounted  元素插入父 DOM 后发生。
    beforeUpdate：新的！这是在元素本身更新之前调用的，很像组件生命周期钩子。
    update → 移除！有太多的相似之处要更新，所以这是多余的，请改用 updated。
    componentUpdated → updated
    beforeUnmount：新的！与组件生命周期钩子类似，它将在卸载元素之前调用。
    unbind -> unmounted
7. 增加teleport：是一种能够将我们的模板移动到 DOM 中 Vue app 之外的其他位置的技术
````

+ 使用compositionAPI的特点/优点
````
1. 相比options API更加灵活
2. 声明在 setup 函数内，一次组件实例化只调用一次 setup
3. 可以将被多次复用的代码逻辑以函数形式抽取出来并使用
4. 解决mixin命名冲突的问题 类似第3点，函数里面的变量在setup里面使用的时候可以解构重命名，解决命名冲突
````

````
1. ref() 的作用就是把一个值类型的数据变成一个响应式数据
e.g:
let count = ref(100)
如果在函数中要把count++
const add = () => {
    count.value ++; // 通过ref()生产的响应式数据，在js使用数据需要加value，在template中可以直接使用
}

2. reactive() 可以让对象类型变响应式数据
let state = reactive({
    name: 'abc',
    age: 12
})
console.log(state) // Proxy对象
return { state }
在template中：{{state.name}}

3. toRefs() 
let state = reactive({
    name: 'abc',
    age: 12
})
return { ...toRefs(state) }
在template中： {{name}}
在js中：state.name

4. toRef() 单个的
let age = toRef(state, 'age');

5. 通过ref获取dom元素或者组件使用ref声明一个响应式数据
<div ref="h1"></div>

setup(props, ctx) {
    let h1 = ref(null)
    onMounted(() => {
        console.log(h1.value)
    })
    
    return { h1 }
}


````
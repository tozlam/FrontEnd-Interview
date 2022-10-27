+ JSX语法底层渲染机制
````
三步：
1. 基于babel-preset-react-app语法包，可以把jsx语法渲染解析为React.createElement格式
    遇到"HTML标签/调用组件标签"，就会创建为createElement格式
    React.createElement(
        标签名/组件,
        属性对象：对象中包含标签上设置的各个属性（没有则为null），
        后续参数都是其子节点
    )
    
2. 把React.createElement方法执行，创建出'JSX元素对象/虚拟DOM对象/React child'
    {
      $$typeof: Symbol(react.element)，
      type: "div", // 标签名/组件
      props: {
        含解析出来的各个属性，
        如果有子节点，则多一个children属性（没有子节点就没有这个属性），属性可能是一个值或者是一个数组
      }，
      ref： null，
      key： null
    }
    
3. root.render 把虚拟dom对象转换为真实dom对象，放在浏览器中渲染
````

+ 组件
````
三种形式：
1. 函数组件 是静态组件
   + 不具备状态、生命周期函数、ref等内容
   + 第一次渲染完毕，除非父组件控制其重新渲染，否则内容不会再更新
   + 优势： 渲染速度快
   + 弊端： 静态组件，无法实现组件动态更新
   
    // Demo.jsx
    import React from 'react';
    import PropTypes from 'prop-types';
    
    const Demo = function Demo(props) {
        // let children = props.children; // 获取到的值有可能是undefined/一个值/一个数组
        let children = React.Children.toArray(props.children), // 将子节点转换成数组形式，可以保证children是个数组
            headSlot = children.filter(item => item.props.slot === 'head'), // 筛选出对应的slot 模拟实现具名插槽
            footSlot = children.filter(item => item.props.slot === 'foot')
        let {x} = props
        return <div>
            {headSlot}
            {x}
            {footSlot}
         </div>
    }
    // 给props设置默认值
    Demo.defaultProps = {
        num: 100
    }
    // 给props设置规则
    Demo.propTypes = {
        x: PropTypes.number.isRequired,
        y: PropType.string,
        arr: PropType.array
    }
    
    export default Demo;
    
    // index.jsx
    ...
    root.render(
    <>
        <demo x={100} y='30' arr={[10,20,30]}>
            <div slot='head'>head</div>
            <div slot='foot'>foot</div>
        </demo>
    </>
);
````
````
2. 类组件 是动态组件
    + 具备属性及规则校验
    + 具备状态、修改状态可以控制视图更新：setState、forceUpdate
    + 具备ref可以获取dom元素或者组件实例
    + 具备周期函数
    
    // Demo.jsx
    improt React from 'react';
    import PropTypes from 'prop-types';
    
    class Demo extends React.Component{
        // 属性规则处理
        static defaultProps = {
            x: 0,
            y: 0
        }
        static propTypes = {
            x: PropTypes.number,
            y: PropTypes.number
        }
        
        // 状态
        state = {
            num: 10
        }
    
        constructor(props) {
            super(); // 根据es6继承原则 一旦写了constructor就要先执行super
            
        }
        
        componentDidMount() {
            console.log('第一次渲染完')
        }
        
        shouldComponentUpdate(nextProps, nextState) {
            console.log(this.props, this.state); // 原有的属性和状态
            console.log(nextProps, nextState); // 即将要修改的属性和状态
            return true;
        }
        
        componentDidUpdate() {
            console.log('视图更新完毕')
        }
        
        render() {
            let { num } = this.state;
            return <div>
                {num}
                <br/>
                <button onClick={() => {
                    // this.state.num = 200;
                    // this.forceUpdate(); // 控制视图强制更新
                    
                    this.setState({
                        num: 200
                    }, () => {
                        console.log('setState回调函数')
                    }) // setState修改状态的同时，也可以控制视图的更新
                }}>
            </div>
        }
    };
    export default Demo;


流程：
new Demo([props]){
    1. getDefalutProps && 属性规则校验
    2. 初始化
        + 把constructor执行，把处理好的props传递给constructor
            + super()等价于React.Component.call(this) 
                -> 这样的this.props = undefined
            + super(props) 此处直接把传递进来的props挂载到实例上
                -> this.props = {...}
        + 初始化状态 this.state = {...}
    3. 初始化结束后，会把props/context这些信息挂载到实例上
    4. 触发一个周期函数 componentWillMount：第一次渲染之前
                        + 不安全的周期函数 建议放弃这个周期函数
    5. 触发render周期函数
        + 把render执行返回的jsx元素对象(虚拟dom对象)进行渲染解析
        + render必须要有，必选返回jsx
    6. 触发componentDidMount周期函数：第一次渲染完
        + 获取真实dom元素
        + 从服务器获取数据
        + 设置定时器或者监听器
        + ...
}
````

+ setState
````
基于setState修改状态，通知更新视图
    1. 触发shouldComponentUpdate：是否允许更新
        + 返回true：允许更新，继续执行后续步骤
        + 返回false：停止更新，状态/属性值也不会修改，视图不会更新
        + 可以基于这个周期函数做项目优化
        + 进行到这一步，状态和属性还没有改为最新的值
    2. 触发componentWillUpdate：不安全的
        + 进行到这一步，状态和属性还没有改为最新的值
    3. 修改状态/属性值为最新值，基于this.state/this.props访问获取到也是最新值
    4. 触发render：让视图按照最新的值进行渲染更新
    5. 触发componentDidUpdate：视图更新完毕
    6. 如果setState设置了回调函数，则把回调函数触发执行 类似于vue中的$nextTick()
        + 及时shouldComponentUpdate返回的是false，此回调函数也会触发执行

在react18中，对于setState操作采用了批处理（异步更新）：
+ 构建了队列机制
+ 统一更新，提高视图更新的性能
+ 处理流程更加稳健

...
state = {
    num: 0
}
componentDidMount() {
    for(let i = 0; i < 10; i++) {
        this.setState((prevState) => {
            return {
                num: prevState.num + 1 // 因为是批处理，还没统一更新，所以prevState是上一次更改的状态值
            }
        })
    }
}


使用flushSync强制刷新
import {flushSync} from 'react-dom'
...
state = {
    x: 10, y: 5, z: 0
}
handler = () => {
    let {x, y, z} = this.state
    this.setState({x: x+1})
    flushSync(() => {
        this.setState({y: y+1})
    }) 
    // flushSync回使队列强制更新一次 x->11 y-> 6 render
    
    this.setState({z: z+ 1})
    console.log(this.state) // {x: 11, y: 6, z: 0}
    
    // 当前上下文代码执行完成 刷新一次队列 z -> 1 render
}

````

````
基于forceUpdate强制让视图更新
    1. 直接跳过触发shouldComponentUpdate，继续下一步操作
    ...跟setState一样
````

````
组件销毁
    1. 触发componentWillUnmount周期函数：销毁之前
        + 把手动设置的事件、定时器、监听器..手动释放掉来优化性能
        + 对目前组件中的一些信息做缓存（例如做草稿箱）
        + ...
    2. 销毁
````

+ pureComponent
````
继承React.PrueComponent，会默认创建一个shouldComponentUpdate周期函数，他默认在这个
周期函数中，做了一个浅比较：拿最新要修改的属性和状态和之前的属性状态进行比较，如果一样则不更新
````

+ ref相关操作：
````
    1.ref={函数}，在视图渲染的时候，会把这个函数执行，传递进来的实参就是当前标签的dom元素对象，我们把其赋值给实例的一个私有属性即可
    ...
    handler = () => {
        console.log(this.box); // <span>0</span>
    }
    render() {
        return <div>
            <span ref={x => this.box = x}>0</span>
        </div>
    }
    ...
    
    2. 基于createRef创建一个ref对象，把对象赋值给元素标签的ref属性；这样对应的dom元素会绑定给ref对象的current属性
    ...
    box = createRef();
    handler = () => {
        console.log(this.box.current); // 对应实例
    }
    render() {
        return <div>
            <span ref={this.box}>0</span>
        </div>
    }
    ...
    
    基于ref获取子组件实例
        把ref赋值给标签：获取dom元素
        把ref赋值给类组件： 获取类组件实例
        把ref赋值给函数组件： 报错 
        (遇到ref赋值给函数组件往往不是为了获取函数组件本身的东西，而是基于forwardRef实现ref的转发，既是获取函数组件内部的某些元素)
    ...
    ch1 = createRef();
    ch2 = createRef();
    render() {
        return <div>
            <Child ref={this.ch1} />
            <Child ref={this.ch2} />
    }
    ...
    
    //Child2.jsx
    const Child2 = function Child(props, ref) {
        return <div>
            <div className="box" ref={ref}></div>
        </div>
    };
    export default forwardRef(Child2);


````

+ 合成事件


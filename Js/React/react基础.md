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
    + 具备周期函数可以灵活掌控不同阶段处理不同事情
    + 流程繁琐，渲染速度相对较慢
    + 基于面向对象编程思想设计，更方便实现继承
    
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
````
...
handler = (x, y, ev) => {
    console.log(x, y, ev)
}
render() {
    return <div>
        <button onClick={this.handler.bind(null, 10, 20)}>点击</button> 
        // 利用bind的预处理原则 如果不用bind则在编译时候就执行了handler函数而不是点击才执行
    </div>
}

事件的执行顺序为原生事件先执行，合成事件后执行，合成事件会冒泡绑定到 document 上，所以尽量避免原生事件与合成事件混用，如果原生事件阻止冒泡，可能会导致合成事件不执行，
因为需要冒泡到document 上合成事件才会执行。

````

````
3. Hooks组件 基于React中提供的Hook函数，可以让函数组件动态化
基础Hook
+ useState 使用状态管理
+ useEffect 使用周期函数
+ useContext 使用上下文信息

额外的Hook
+ useReducer useState的替代方案，借鉴Redux处理思想，管理更复杂的状态和逻辑
+ useCallback 构建缓存优化方案
+ useMemo 构建缓存优化方案
+ useRef 使用ref获取DOM
+ useImperativeHandle 配合forwardRef一起使用
+ useLayoutEffect 与useEffect相同，但会在所有DOM变更之后同步调用effect
...
````

+ useState
````
作用：在函数组件中使用状态，修改状态值可让函数组件更新，类似于类组件中的setState
eg：const [num, setNum] = useState(10);// 返回一个state 以及更新state的函数
+ 更新state的函数不像类组件中的this.setState一样，他不支持部分状态修改

...
let [state, setState] = useState({
    x: 10,
    y: 20
})
const handler = () => {
    setState({
        ...state,
        x: state.x + 1
    })
}
return <div>
    {state.x}{state.y}
    <button onClick={handler}></button>
</div>
...
+ 推荐分开使用useState，实现多状态管理
...
let [x, setX] = useState(10), [y, setY] = useState(20)
...
+ react18 建立了更新队列，实现批处理（修改状态方法是异步操作的）
+ react16 出现在合成事件、周期函数中的状态更新，使用的是更新队列和批处理；但是出现在其他异步操作中，更新状态的方法是同步处理的

+ 如果下一个方法执行的时候可以获取上个方法已经处理好的值 => 函数式更新
...
const handler = () => {
    for (let i = 0; i < 10; i++) {
        setNum(num => {
            return num + 1;
        })
    }
}
...
+ 可以基于flushSync刷新渲染队列

+ 惰性初始state
如果初始state需要通过复杂计算获得，可以传入一个函数，在函数中计算并返回初始的state，此函数只在初始渲染时被调用
...
export default function demo(props) {
    let [num, setNum] = useState(() => {
        let {x, y} = props;
        return x + y
    })
}
...

+ 性能优化
调用state hook的更新函数，并传入当前state时(更新的值跟当前的值一样)，react将跳过组件的渲染（函数不会执行）（因为react使用Object.is比较算法来比较新老state，不是因为dom-diff!）
【类组件中，当新老状态值相同，在没有设置shouldComponentUpdate或者继承pureComponent的前提下，render还会执行，重新生成新的虚拟dom，只不过和之前的虚拟dom一模一样，不需要更新真实dom】
````

+ useEffect
````
作用： 在函数组件中使用生命周期函数
useEffect只能出现在函数组件的最外层，不能嵌套在判断、循环等操作中

...
// 第一次渲染完 && 每一次更新完 触发更新
useEffect(() => {
    console.log()
})
...
...
// 第一次渲染完 触发更新
useEffect(() => {
    console.log()
}, []) // 没填依赖项
...
...
// 第一次渲染完 && num状态改变 触发更新
useEffect(() => {
    console.log()
}, [num]) // 依赖项为num
...

...
let [data, setData] = useState([])
// 第一次渲染完成 从服务器获取数据
useEffect(() => {
    queryData().then(value => {
        setData(value)
    })
}, [])
...
...
let [data, setData] = useState([])
// 第一次渲染完成 从服务器获取数据
useEffect(() => {
    const next = async () => {
        let result = await queryData();
        setData(result);
    }
    next();
}, [])
// 不可以直接将async/await写在useEffect的callback函数上面
...

useEffect里面的callback的return相当于vue里面的unmounted，是在销毁后执行的

useEffect原理：
函数组件在渲染/更新期间，遇到useEffect操作，会基于MountEffect方法把callback和依赖项加入到effect链表中

在视图渲染完毕后，基于UpdateEffect方法，通知链表中的方法执行
1. 按照顺序执行期间，首先会检测依赖项的值是否有更新【有容器专门记录上一次依赖项的值】；有更新则把对应callback执行，没有则继续处理下一项
2. 遇到依赖项是空数组的，则只在第一次渲染完毕时，执行相应的callback
3. 遇到没有设置依赖项的，则每一次渲染完毕时都执行相应的callback


````

+ useLayoutEffect
````
useEffect向effect链表中增加的callback函数，会在真实dom已经彻底渲染完毕后触发执行
useLayoutEffect向effect链表中增加的callback函数，在视图编译完，还没有渲染真实dom之前，触发执行
````

+ useRef
````
在函数组件中，可以基于useRef获取dom元素
类似的方法有：
1. ref = {x => this.box = x}
2. React.creatRef 

+ creatRef每次渲染都会返回一个新的引用
+ useRef每次都会返回相同的引用

+ 如果子组件是个类组件，我们为其设置ref，最后获取的是子组件的实例【可以调用子组件商提供的属性和方法】
+ 函数子组件不能直接为其设置ref（会报错）；可以用forwardRef函数包起来


+ useImperativeHandle可以在让你使用ref时自定义暴露给父组件的实例值（与forwardRef一起使用），实现ref转发
基于forwardRef和useImperativeHandle就可以实现父组件调用子组件中的方法
...
const Child = forwardRef(function Child (props, ref) {
    const submit = () => {}
    
    useImperativeHandle(ref, () => {
        return {
            submit,
            name: 'Child'
        }
    }); // 实现父组件调用子组件中的方法
    return <div>
    </div>
});
export default function Demo() {
    const box = useRef(null);
    
    useEffect(() => {
        box.current.submit();
    })
    
    return <div>
        <Child ref={box} />
    </div>
}
...

````

+ useMemo
````
实现数据的缓存
场景：视图需要呈现的内容是经过复杂且大量消耗性能的计算得来的

...
let [x, setX] = useState(10);
let [y, setY] = useState(20);

const cacheVal = useMemo(() => {
    // 经过复杂的计算 依赖于x
    return x
}, [x])

return <div>
    <span>{cacheVal}</span>
    <button onClick={() => setX(x + 1)}>修改x</button>
    <button onClick={() => setY(y + 1)}>修改y</button>
  </div>
...

````

+ useCallback
````
构建缓存的优化
主要用于父子组件嵌套，父组件会基于属性把方法传递给子组件
useCallback可以保证父组件（函数组件）每次更新不会创建新的函数堆，而是获取之前的函数引用，这样传递给子组件的函数值不会变化；
(如果子组件做了优化，例如pureComponent、memo...，则可以避免子组件的无效更新，节约性能)

pureComponent与useCallback
...
class Child1 extends React.pureComponent {
    render() {
        return <div>
            <button onClick={this.props.handler}>处理1</button>
        </div>
    }
}

class Child2 extends React.pureComponent {
    render() {
        return <div>
            <button onClick={this.props.handler}>处理2</button>
        </div>
    }
}


export default function Demo () {
    let [num, setNum] = useState(0)
    
    // 第一次执行，创建函数堆 0x001
    // 第二次执行，不会创建新的函数，用的还是之前的值 0x001
    const handler1 = useCallback(() => {
        
    }, []);
    
    // 第一次执行，创建函数堆 0x002
    // 第二次执行，创建函数堆 0x003
    const handler2 = () => {
        
    };
    
    
    return <div>
        <Child1 handler={handler1}/>
        <Child2 handler={handler2}/>
    </div>
}
...

memo与useCallback
...
const Child1 = memo(function Child1(props) {
    return <div>
        <button onClick={props.handler}>处理</button>
    </div>
})
export default function Demo () {
    let [num, setNum] = useState(0)
    
    // 第一次执行，创建函数堆 0x001
    // 第二次执行，不会创建新的函数，用的还是之前的值 0x001
    const handler1 = useCallback(() => {
        
    }, []);
 
    return <div>
        <Child1 handler={handler1}/>
    </div>
}


....
````

+ 自定义Hook
````
使用自定义Hook可以将某些组件逻辑提取到可重用的函数中

...
// 自定义Hook：提供公共的操作和逻辑
const usePartState = function usePartState(initial) {
    let [state, setState] = useState(initial);
    
    const setPartState = (partState) => {
        setState({
            ...state,
            ...partState
        })
    }
    return [state, setPartState]
}

export default function Demo(props) {
    let [state, setState] = usePartState({
        x: 10,
        y: 20
    })
    const handler = () => {
        setState({
            x: state.x + 10
        })
    }
    
    return <div>
        <span>{state.x}</span>
        <span>{state.y}</span>
        <button onClick={handler}>处理</button>
    </div>
}
...

````




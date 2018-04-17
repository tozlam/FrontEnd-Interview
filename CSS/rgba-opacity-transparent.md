# rgba/opacity/transparent

三者共同点是都和透明有关。先分着来说一下：

1. opacity用来设置元素的不透明级别，从 0.0 （完全透明）到 1.0（完全不透明）。
2. transparent是颜色的一种，这种颜色叫透明色。
3. rgba(r,g,b,a):
    - r：红色值；
    - g：绿色值；
    - b：蓝色值。
    <br>三个颜色值组合在一起就形成最终颜色。
    - a：alpha透明度。表示像素不透明性的值。像素越不透明，则隐藏越多呈现图像的背景。取值0-1之间。0表示完全透明的像素，1表示完全不透明的像素。

 
区别：

1. opacity是作为一个完整属性出现的。transparent和rgba都是作为属性值出现的。

2. opacity是对于`整个元素`起作用的。打个比方，就像拿一块玻璃糊在了这个元素上，盖上的地方都会受到影响。<br>
而transparent和alpha是对元素的某个属性起作用的。任何需要设置颜色的地方都可以根据情况使用transparent或rgba。比如背景、边框、字体等等。哪个属性的颜色设置了transparent，哪个属性就是透明的，完全透明。哪个属性用rgba()设置了透明，就对哪个属性起作用，透明程度可设置。

3. 由于opacity和alpha设置的透明程度可调，就引出一个继承的问题。如果一个元素未设置opacity属性，那么它会从它的父元素继承opacity属性的值。而alpha不存在继承。

e.g:
##### opacity
````
<p style="background-color: red; opacity: 1;">  这是一个p标签，颜色red，opacity值为1 </p>
<span style="background-color: green; opacity: 1; ">2）这是一个span标签，颜色green，opacity值为1</span>
 <p style="background-color: red; opacity: 0.6;">
     3）这是一个p标签，颜色red，opacity值为0.6
     <span style="background-color: green; ">这是一个span标签，颜色green，opacity未设置</span>
</p>
````
结果：
![opacity](../img/rgba-opacity-01.jpg)

##### rgba
````
<p style="background-color: rgba(255,0,0,1);">1）这是一个p标签，颜色red，透明度为1</p>
<span style="background-color: green;">2）这是一个span标签，颜色green，透明度为1</span>            
<p style="background-color: rgba(255,0,0,0.5);">
     3）这是一个p标签，颜色red，透明度为0.5
     <span style="background-color: green;">（这是一个span标签，颜色green，透明度未设置）</span>
</p>
````
结果：
![rgba](../img/rgba-opacity-02.jpg)




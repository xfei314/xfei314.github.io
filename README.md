# xdp - portal

微前端框架的 portal

## 菜单

所有模块
logo
打开的各个子产品

二级菜单 ，tabs （dashboard 个人主页， 当前页面）

中间 页面内容

vite 4 加载样式的代码：
ve(ovite resoweStyle(v
这个 **vite**updateStyle 具体代码实现：
documnt hesd oprerdoitd(styte) style - style (disableds false, Redia： -》

无界子应用如果是单例模式，js 只会执行一遍，动态加载进来的样式，无界需要收集起来，等子应用下次切换回来，再将这些样式恢复，对于 document.body.appendChild，和 document.head.appendChild 这样的方法 无界内部已经劫持进行收集，但是 vite4 上面的代码可以看到采用了 style.InsertAdjacentElement 这样的方法导致无界没有收集到，所以采用下面的插件修改一下 style.InsertAdjacentElement 成 document.head.appendChild 可以了，当然也可以不修改 InsertAdjacentElement，将 InsertAdjacentElement 进来的样式放进 iframeWindow.\_\_WUJIE.styleSheetElements 里面，下次渲染就可以将样式还原了

{
patchElementHook(element, iframeWindow) {
if (element.nodeName === "STYLE") {
element.insertAdjacentElement = function (\_position, ele) {
iframeWindow.document.head.appendChild(ele);
};
}
},
},

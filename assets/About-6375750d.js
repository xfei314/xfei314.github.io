import{_ as v}from"./index-5401f4f5.js";await Promise.all([window.__OSL.import("xdp/ui/color-picker"),window.__OSL.import("vue")]);const{ColorPicker:c}=window.__OSL.getModule("xdp/ui/color-picker"),{ref:p}=window.__OSL.getModule("vue"),{createElementVNode:e,toDisplayString:a,resolveComponent:m,createVNode:g,vModelText:s,withDirectives:_,createTextVNode:U,createStaticVNode:f,openBlock:h,createElementBlock:x,pushScopeId:k,popScopeId:w}=window.__OSL.getModule("vue"),o=r=>(k("data-v-579f3395"),r=r(),w(),r),S={class:"about"},V=o(()=>e("h1",null,"about ",-1)),q=o(()=>e("h2",null,"h5 原生标签",-1)),b={class:"box"},y=o(()=>e("h3",null,"1 点击选择颜色",-1)),N=o(()=>e("pre",null,a('<input type="color" v-model="color" />'),-1)),I=o(()=>e("h3",null,"1.2 日期",-1)),O=o(()=>e("pre",null,a('<input type="date" v-model="date" />'),-1)),L=o(()=>e("h3",null,"1.3 range 范围选择",-1)),M=o(()=>e("pre",null,a('<input type="range" v-model="range" />'),-1)),B=f('<div class="box" data-v-579f3395><h3 data-v-579f3395>2 使用 &lt;meter&gt; 标签测量给定范围内的数据。</h3><pre data-v-579f3395>&lt;p&gt;指定最大10 占用2&lt;/p&gt;</pre><pre data-v-579f3395>&lt;meter value=&quot;0.7&quot;&gt;70%&lt;/meter&gt;</pre><pre data-v-579f3395>&lt;p&gt;直接占用总长70%&lt;/p&gt;</pre><pre data-v-579f3395>&lt;meter value=&quot;2&quot; min=&quot;0&quot; max=&quot;10&quot;&gt;2/10&lt;/meter&gt;</pre><p data-v-579f3395>指定最大10 占用2</p><meter value="0" min="-10" max="10" data-v-579f3395></meter><p data-v-579f3395>直接占用总长70%</p><meter value="0.7" data-v-579f3395></meter></div><div class="box" data-v-579f3395><h3 data-v-579f3395>3 使用 &lt;progress&gt; 进度条</h3><pre data-v-579f3395>&lt;progress value=&quot;22&quot; max=&quot;100&quot;&gt;&lt;/progress&gt;</pre><progress value="22" max="100" data-v-579f3395></progress></div><div class="box" data-v-579f3395><h3 data-v-579f3395>4 使用 &lt;mark&gt;mark文本&lt;/mark&gt; 标签定义带有记号的文本 </h3> 普通文本 <mark data-v-579f3395>mark文本</mark></div><div class="box" data-v-579f3395></div>',4),C={components:{XColorPicker:c}},D=Object.assign(C,{__name:"About",setup(r){const d=p(""),n=p(null),u=p(null);return(E,t)=>{const i=m("x-color-picker");return h(),x("div",S,[V,q,e("div",b,[y,N,g(i,{modelValue:d.value,"onUpdate:modelValue":t[0]||(t[0]=l=>d.value=l)},null,8,["modelValue"]),_(e("input",{type:"color","onUpdate:modelValue":t[1]||(t[1]=l=>d.value=l)},null,512),[[s,d.value]]),e("h4",null,a(d.value),1),I,O,_(e("input",{type:"date","onUpdate:modelValue":t[2]||(t[2]=l=>n.value=l)},null,512),[[s,n.value]]),e("h4",null,a(n.value),1),L,M,_(e("input",{type:"range","onUpdate:modelValue":t[3]||(t[3]=l=>u.value=l)},null,512),[[s,u.value]]),e("h4",null,a(u.value),1)]),B])}}}),A=v(D,[["__scopeId","data-v-579f3395"]]);export{A as default};
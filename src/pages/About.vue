<template>
  <div class="about">
    <h1>about</h1>
    <h2>h5 原生标签</h2>
    <div class="box">
      <h3>1 点击选择颜色</h3>
      <pre>{{`<input type="color" v-model="color" />`}}</pre>
      <x-color-picker v-model="color" />
      <input type="color" v-model="color" />
      <h4>{{ color }}</h4>

      <h3>1.2 日期</h3>
      <pre>{{`<input type="date" v-model="date" />`}}</pre>
      <input type="date" v-model="date" />
      <h4>{{ date }}</h4>
      <h3>1.3 range 范围选择</h3>
      <pre>{{`<input type="range" v-model="range" />`}}</pre>
      <input type="range" v-model="range" />
      <h4>{{ range }}</h4>
    </div>
    <div class="box">
      <h3>2 使用 {{`<meter />`}} 标签测量给定范围内的数据。</h3>

      <pre>{{ `<p>指定最大10 占用2</p>`}}</pre>
      <pre>{{ `<meter value="0.7">70%</meter>`}}</pre>
      <pre>{{ `<p>直接占用总长70%</p>`}}</pre>
      <pre>{{ `<meter value="2" min="0" max="10">2/10</meter>`}}</pre>

      <p>指定最大10 占用2</p>
      <meter value="0" min="-10" max="10"></meter>
      <p>直接占用总长70%</p>
      <meter value="0.7"></meter>
    </div>
    <div class="box">
      <h3>3 使用 {{`<progress />`}} 进度条</h3>
      <pre>{{ `<progress value="22" max="100"></progress>`}}</pre>
      <progress value="22" max="100"></progress>
    </div>
    <div class="box">
      <h3>4 使用 {{`<mark>mark文本</mark>`}} 标签定义带有记号的文本</h3>
      普通文本 <mark>mark文本</mark>
    </div>
    <div class="box"></div>
  </div>
</template>
<script setup>
import { ref } from "vue";
const color = ref("");
const date = ref(null);
const range = ref(null);
</script>
<style lang="less" scoped>
.about {
  .box {
    min-height: 100px;
  }
}
</style>

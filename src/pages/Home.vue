<template>
  <div class="home">
    <h1>home</h1>
    <x-button> default btn </x-button>

    <x-button type="primary" @click="onClick1"> 主题 </x-button>

    <div class="box">
      <h3>1 动态修改主题色</h3>
      <pre>{{`<input type="color" v-model="color" />`}}</pre>
      <input type="color" v-model="state.primaryColor" />
      <h4>{{ state.primaryColor }}</h4>
    </div>
  </div>
</template>
<script setup>
import { Message } from "xdp";
import useSystem from "@/store/system";
const { state } = useSystem();

function onClick1() {
  Message.info("111");
}
</script>
<style lang="less" scoped>
.home {
  .box {
    min-height: 100px;
  }
  :deep(.xdp-color-picker) {
    width: 200px;
  }
}
</style>

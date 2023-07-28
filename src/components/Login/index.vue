<template>
  <x-modal
    title="登录"
    title-align="left"
    v-model:visible="visible"
    :style="style"
    class="app-login"
    :closable="false"
    :footer="false"
    :mask-closable="false"
    width="400px"
    draggable
  >
    <LoginForm @submit="submit" @close="visible = false" :loading="loading" />
  </x-modal>
</template>
<script setup>
// import Dynamic from "@/components/dynamic";
import { ref } from "vue";
import { Message } from "xdp";
import LoginForm from "./LoginForm.vue";
import useSystem from "@/store/system";
const { login } = useSystem();
const loading = ref(false);
const visible = defineModel();

async function submit({ account, password }) {
  loading.value = true;
  // 验证成功 提交
  try {
    let res = await login({ account, password });
    console.log("x onSubmit login ", res);
    if (!res) return;
    Message.success(`登录成功 - ${account}`);
    visible.value = false;
  } finally {
    loading.value = false;
  }
}
</script>
<style lang="less">
.app-login {
  backdrop-filter: blur(2px);
  // .t-modal {
  // 	width: auto;
  // }
}
</style>

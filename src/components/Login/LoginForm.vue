<template>
  <x-form class="login-form" :rules="rules" :model="formData" :label-width="0" ref="formRef" @submit="handleSubmit">
    <x-form-item field="account">
      <x-input v-model="formData.account" allow-clear placeholder="请输入账户名" />
    </x-form-item>

    <x-form-item field="password">
      <x-input-password v-model="formData.password" allow-clear placeholder="请输入密码" />
    </x-form-item>
    <div class="btn">
      <x-button type="primary" html-type="submit">登录</x-button>
      <x-button @click="$refs.formRef.resetFields()">清除</x-button>
    </div>
  </x-form>
</template>

<script setup>
import { reactive } from "vue";

defineProps({
  loading: Boolean,
});
const emit = defineEmits(["close", "submit"]);

const rules = {
  account: [
    { required: true, message: "账户名必填" },
    {
      minLength: 2,
      message: "至少需要两个字",
    },
  ],
  password: [
    { required: true, message: "密码必填", trigger: ["change", "input"] },
    {
      minLength: 5,
      message: "至少需要5字符",
      trigger: ["change", "input"],
    },
  ],
};
const formData = reactive({
  account: "admin",
  password: "666666",
});

const handleSubmit = ({ values, errors }) => {
  console.log("values:", values, "\nerrors:", errors);
  if (errors) {
    // let firstError = errors[Object.keys(errors)[0]];
    // Message.error(firstError.message);
    return;
  }
  emit("submit", values);
};
</script>

<style lang="less">
.login-form {
  .btn {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
  }
}
</style>

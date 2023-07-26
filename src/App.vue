<template>
  <div>HelloWorld !!!</div>
  <div>
    <button @click="num++">t-1 : {{ num }}</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
const num = ref(0);
</script>
<style scoped></style>

<template>
  <x-drawer
    class="app-menu-drawer"
    :style="style"
    size="100%"
    v-model:visible="visible"
    placement="top"
    :header="false"
    :footer="false"
    :showOverlay="false"
  >
    <x-dynamic :is="AppMenu" />
  </x-drawer>
</template>
<script setup>
import { computed } from "vue";

import AppMenu from "./AppMenu.vue";

const props = defineProps({
  modelValue: Boolean,
  top: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["update:modelValue"]);
const visible = computed({
  get: () => {
    return props.modelValue;
  },
  set: val => {
    emit("update:modelValue", val);
  },
});
const style = computed(() => {
  return {
    top: `${props.top}px`,
    height: `calc(100% - ${props.top}px)`,
  };
});
</script>

<style lang="less">
.app-menu-drawer {
  .x-drawer__body {
    height: 100%;
    display: flex;
    gap: 8px;

    .aside {
    }
    .content {
      flex: 1;
      width: 1px;
    }
  }
}
</style>

<template>
  <MenuTree
    v-bind="{
      id: rootId,
      rootId: rootId,
      treeData: menus,
    }"
  />
</template>
<script>
export default {
  inheritAttrs: false,
};
</script>
<script setup>
import { watchPostEffect } from "vue";
import MenuTree from "./MenuTree.vue";
const props = defineProps({
  rootId: {
    type: String,
    default: "0",
  },
  menus: {
    type: Array,
    default: () => [],
  },
});

watchPostEffect(() => {
  console.log("ccc    props.menus   ", props.menus);
});
</script>

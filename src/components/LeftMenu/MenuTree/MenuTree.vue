<template>
  <template v-if="childData.length > 0">
    <template v-if="id === rootId">
      <MenuTree
        v-for="item in childData"
        :key="item.id"
        v-bind="{
          id: item.id,
          pid: item.pid,
          title: item.title,
          icon: item.icon,
          show: item.show,
          rootId: rootId,
          treeData: treeData,
        }"
      />
    </template>
    <template v-else>
      <x-sub-menu :key="id">
        <template #icon>
          <icon v-if="icon" :name="icon" />
        </template>
        <template #title>{{ title }}</template>
        <MenuTree
          v-for="item in childData"
          :key="item.id"
          v-bind="{
            id: item.id,
            pid: item.pid,
            title: item.title,
            icon: item.icon,
            show: item.show,
            rootId: rootId,
            treeData: treeData,
          }"
        />
      </x-sub-menu>
    </template>
  </template>
  <template v-else>
    <x-menu-item :key="id">
      <template #icon>
        <icon v-if="icon" :name="icon" />
      </template>
      {{ title }}
    </x-menu-item>
  </template>
</template>

<script setup>
import { computed } from "vue";
defineOptions({
  name: "MenuTree",
  inheritAttrs: false,
});
const props = defineProps({
  rootId: {
    type: String,
    default: "0",
  },
  id: {
    type: String,
    default: "0",
  },
  pid: {
    type: String,
    default: "0",
  },
  title: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  show: {
    type: Boolean,
    default: false,
  },
  treeData: {
    type: Array,
    default: () => [],
  },
});
const childData = computed(() => {
  return props.treeData.filter(r => r.pid === props.id);
});
</script>
